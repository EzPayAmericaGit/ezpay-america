import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { applicationId } = await req.json();

    if (!applicationId || typeof applicationId !== 'string' || applicationId.length > 100) {
      return Response.json({ error: 'Valid Application ID is required' }, { status: 400 });
    }

    const applications = await base44.asServiceRole.entities.MerchantApplication.filter({
      id: applicationId
    });
    const app = applications[0];

    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    const data = app.applicationData || {};

    // Sanitize all data fields before passing to LLM (prevent prompt injection)
    const safe = (val, max = 200) => String(val || 'N/A').replace(/[\r\n<>"'`]/g, ' ').substring(0, max);

    const prompt = `Analyze this merchant application for payment processing risk assessment:

Business Information:
- Legal Name: ${safe(data.legalBusinessName)}
- DBA: ${safe(data.dbaName)}
- Business Type: ${safe(data.businessMarketType, 50)}
- Formation: ${safe(data.businessFormationType, 50)}
- Date Started: ${safe(data.dateBusinessStarted, 20)}
- Location Type: ${safe(data.businessLocationType, 50)}
- Number of Locations: ${safe(data.numberOfLocations, 10)}

Processing Information:
- Monthly Volume: $${safe(data.monthlyVolume, 20)}
- Annual Volume: $${safe(data.annualVolume, 20)}
- Average Ticket: $${safe(data.averageTicket, 20)}
- Largest Ticket: $${safe(data.largestTicket, 20)}
- % Swiped: ${safe(data.percentageSwiped, 10)}%
- % Keyed: ${safe(data.percentageKeyed, 10)}%
- % Internet: ${safe(data.percentageInternet, 10)}%

Sales & Delivery:
- Products: ${safe(data.productsDescription, 300)}
- Order Methods: ${safe(Array.isArray(data.orderMethod) ? data.orderMethod.join(', ') : data.orderMethod, 100)}
- Delivery Timeframe: ${safe(data.deliveryTimeframe, 100)}
- Payment Timing: ${safe(data.paymentTiming, 50)}
- Geographic Areas: ${safe(data.geographicAreas, 100)}
- International Card %: ${safe(data.internationalCardPercentage, 10)}%

Provide a comprehensive risk assessment with:
1. Overall risk score (1-100, where 100 is highest risk)
2. Risk level classification (low, medium, high)
3. Key risk factors identified
4. Red flags or concerns
5. Positive indicators
6. Recommendations for approval/denial/further review
7. Suggested monitoring requirements if approved`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          risk_score: { type: "number" },
          risk_level: { type: "string" },
          risk_factors: { type: "array", items: { type: "string" } },
          red_flags: { type: "array", items: { type: "string" } },
          positive_indicators: { type: "array", items: { type: "string" } },
          recommendation: { type: "string" },
          monitoring_requirements: { type: "array", items: { type: "string" } },
          summary: { type: "string" }
        }
      }
    });

    return Response.json({ success: true, assessment: response });

  } catch (error) {
    console.error('Risk assessment error:', error);
    return Response.json({ error: 'Failed to assess application risk' }, { status: 500 });
  }
});