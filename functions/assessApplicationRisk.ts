import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { applicationId } = await req.json();

    if (!applicationId) {
      return Response.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const applications = await base44.asServiceRole.entities.MerchantApplication.filter({ 
      id: applicationId 
    });
    const app = applications[0];

    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    const data = app.applicationData || {};

    const prompt = `Analyze this merchant application for payment processing risk assessment:

Business Information:
- Legal Name: ${data.legalBusinessName}
- DBA: ${data.dbaName}
- Business Type: ${data.businessMarketType}
- Formation: ${data.businessFormationType}
- Date Started: ${data.dateBusinessStarted}
- Location Type: ${data.businessLocationType}
- Number of Locations: ${data.numberOfLocations}

Processing Information:
- Monthly Volume: $${data.monthlyVolume}
- Annual Volume: $${data.annualVolume}
- Average Ticket: $${data.averageTicket}
- Largest Ticket: $${data.largestTicket}
- % Swiped (Face to Face): ${data.percentageSwiped}%
- % Keyed (Not Present): ${data.percentageKeyed}%
- % Internet: ${data.percentageInternet}%

Sales & Delivery:
- Products: ${data.productsDescription}
- Order Methods: ${data.orderMethod?.join(', ')}
- Delivery Timeframe: ${data.deliveryTimeframe}
- Payment Timing: ${data.paymentTiming}
- Geographic Areas: ${data.geographicAreas}
- International Card %: ${data.internationalCardPercentage}%

Provide a comprehensive risk assessment with:
1. Overall risk score (1-100, where 100 is highest risk)
2. Risk level classification (low, medium, high)
3. Key risk factors identified
4. Red flags or concerns
5. Positive indicators
6. Recommendations for approval/denial/further review
7. Suggested monitoring requirements if approved`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
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

    return Response.json({ 
      success: true, 
      assessment: response
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});