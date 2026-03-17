import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidZip = (zip) => /^\d{5}(-\d{4})?$/.test(String(zip || '').trim());

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require authentication to prevent abuse
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { zipCode, items } = await req.json();

    if (!zipCode || !isValidZip(zipCode)) {
      return Response.json({ error: 'Valid 5-digit ZIP code required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return Response.json({ error: 'Invalid items array' }, { status: 400 });
    }

    // Validate items to prevent injection via item data
    const totalWeight = items.reduce((sum, item) => {
      const qty = parseInt(item.quantity);
      return sum + (isNaN(qty) ? 0 : Math.max(0, qty));
    }, 0);

    const UPS_ACCESS_TOKEN = Deno.env.get('UPS_ACCESS_TOKEN');

    if (UPS_ACCESS_TOKEN) {
      const upsRequest = {
        RateRequest: {
          Request: { TransactionReference: { CustomerContext: "EzCart Shipping" } },
          Shipment: {
            Shipper: { Address: { PostalCode: "37932", CountryCode: "US" } },
            ShipTo: { Address: { PostalCode: zipCode.trim(), CountryCode: "US" } },
            Service: { Code: "03" },
            Package: {
              PackagingType: { Code: "02" },
              PackageWeight: {
                UnitOfMeasurement: { Code: "LBS" },
                Weight: Math.max(totalWeight, 1).toString()
              }
            }
          }
        }
      };

      const response = await fetch('https://onlinetools.ups.com/api/rating/v1/Rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${UPS_ACCESS_TOKEN}`,
          'transId': crypto.randomUUID(),
          'transactionSrc': 'EzCart'
        },
        body: JSON.stringify(upsRequest)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.RateResponse?.RatedShipment) {
          const shippingCost = parseFloat(data.RateResponse.RatedShipment.TotalCharges.MonetaryValue);
          return Response.json({ success: true, shippingCost });
        }
      }
    }

    // Fallback zone-based pricing
    const zonePricing = {
      '37': 8.99, '30': 10.99, '35': 9.99,
      '38': 9.99, '40': 11.99, '28': 11.99, '29': 11.99
    };
    const zone = zipCode.trim().substring(0, 2);
    const shippingCost = zonePricing[zone] || 14.99;

    return Response.json({ success: true, shippingCost });

  } catch (error) {
    console.error('Shipping calc error:', error);
    return Response.json({ success: true, shippingCost: 12.99 });
  }
});