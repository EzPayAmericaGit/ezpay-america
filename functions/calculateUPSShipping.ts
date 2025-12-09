import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { zipCode, items } = await req.json();

    // Calculate total weight (assuming each item is 1 lb for now)
    const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);

    // UPS API Rate Request
    const upsRequest = {
      RateRequest: {
        Request: {
          TransactionReference: {
            CustomerContext: "EzCart Shipping"
          }
        },
        Shipment: {
          Shipper: {
            Address: {
              PostalCode: "37932", // EzPay America origin zip
              CountryCode: "US"
            }
          },
          ShipTo: {
            Address: {
              PostalCode: zipCode,
              CountryCode: "US"
            }
          },
          Service: {
            Code: "03" // UPS Ground
          },
          Package: {
            PackagingType: {
              Code: "02" // Customer supplied package
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "LBS"
              },
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
        'Authorization': `Bearer ${Deno.env.get('UPS_ACCESS_TOKEN')}`,
        'transId': crypto.randomUUID(),
        'transactionSrc': 'EzCart'
      },
      body: JSON.stringify(upsRequest)
    });

    const data = await response.json();

    if (data.RateResponse?.RatedShipment) {
      const shippingCost = parseFloat(data.RateResponse.RatedShipment.TotalCharges.MonetaryValue);
      return Response.json({ 
        success: true, 
        shippingCost 
      });
    }

    // Fallback to zone-based pricing if UPS API fails
    const zonePricing = {
      '37': 8.99,   // Tennessee
      '30': 10.99,  // Georgia
      '35': 9.99,   // Alabama
      '38': 9.99,   // Mississippi
      '40': 11.99,  // Kentucky
      '28': 11.99,  // North Carolina
      '29': 11.99   // South Carolina
    };

    const zone = zipCode.substring(0, 2);
    const shippingCost = zonePricing[zone] || 14.99;

    return Response.json({ 
      success: true, 
      shippingCost 
    });

  } catch (error) {
    // Fallback pricing on error
    return Response.json({ 
      success: true, 
      shippingCost: 12.99 
    });
  }
});