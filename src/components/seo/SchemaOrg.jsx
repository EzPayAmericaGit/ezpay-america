/**
 * SchemaOrg — Centralized JSON-LD Schema.org component library
 *
 * Usage examples:
 *
 * Service page:
 *   <ServiceSchema
 *     name="ACH Payment Processing"
 *     description="Accept bank transfers with low fees..."
 *     url="https://ezpayamerica.com/ACHPayments"
 *     serviceType="Payment Processing"
 *   />
 *
 * POS / Location page:
 *   <LocalBusinessSchema
 *     name="EzPay America - Hair Salon POS"
 *     description="POS systems for hair salons..."
 *     url="https://ezpayamerica.com/HairSalonPOS"
 *     businessType="FinancialService"
 *   />
 *
 * Both can be used together on the same page.
 */

import { useEffect } from "react";

const BASE = {
  org: "https://ezpayamerica.com/#organization",
  site: "https://ezpayamerica.com",
  logo: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
  phone: "+1-865-316-9625",
  email: "mail@ezpayamerica.com",
};

function injectSchema(id, data) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`script[data-schema-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-schema-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeSchema(id) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(`script[data-schema-id="${id}"]`);
  if (el) el.remove();
}

/**
 * ServiceSchema — for service/payment processing landing pages
 *
 * Props:
 *  - name (string, required): service name, e.g. "ACH Payment Processing"
 *  - description (string, required)
 *  - url (string): canonical URL of the page
 *  - serviceType (string): e.g. "Payment Processing", "POS System"
 *  - areaServed (string): default "United States"
 *  - offers (array): [{ name, description }] list of specific offerings
 *  - image (string): page-specific OG image URL
 */
export function ServiceSchema({ name, description, url, serviceType = "Payment Processing", areaServed = "United States", offers = [], image }) {
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : BASE.site);
  const schemaId = "service-schema";

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${pageUrl}#service`,
          "name": name,
          "description": description,
          "serviceType": serviceType,
          "url": pageUrl,
          "image": image || BASE.logo,
          "provider": {
            "@type": "Organization",
            "@id": BASE.org,
            "name": "EzPay America",
            "url": BASE.site,
            "logo": { "@type": "ImageObject", "url": BASE.logo },
            "telephone": BASE.phone,
            "email": BASE.email,
          },
          "areaServed": {
            "@type": "Country",
            "name": areaServed,
          },
          ...(offers.length > 0 && {
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": `${name} Offerings`,
              "itemListElement": offers.map(o => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": o.name,
                  "description": o.description || "",
                },
              })),
            },
          }),
        },
        {
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          "url": pageUrl,
          "name": `${name} | EzPay America`,
          "description": description,
          "isPartOf": { "@id": `${BASE.site}/#website` },
          "about": { "@id": BASE.org },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE.site },
              { "@type": "ListItem", "position": 2, "name": name, "item": pageUrl },
            ],
          },
        },
      ],
    };
    injectSchema(schemaId, schema);
    return () => removeSchema(schemaId);
  }, [name, description, url, serviceType, areaServed, image]);

  return null;
}

/**
 * LocalBusinessSchema — for POS / industry-specific landing pages
 *
 * Props:
 *  - name (string, required): e.g. "EzPay America - Hair Salon POS Systems"
 *  - description (string, required)
 *  - url (string): canonical URL
 *  - businessType (string): Schema.org type, e.g. "FinancialService", "LocalBusiness"
 *  - industryServed (string): e.g. "Hair Salons", "Restaurants"
 *  - image (string): page-specific image
 *  - offers (array): [{ name, description }]
 */
export function LocalBusinessSchema({ name, description, url, businessType = "FinancialService", industryServed, image, offers = [] }) {
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : BASE.site);
  const schemaId = "localbusiness-schema";

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": [businessType, "LocalBusiness"],
          "@id": `${pageUrl}#localbusiness`,
          "name": name,
          "description": description,
          "url": pageUrl,
          "image": image || BASE.logo,
          "logo": { "@type": "ImageObject", "url": BASE.logo },
          "telephone": BASE.phone,
          "email": BASE.email,
          "priceRange": "Free - $$",
          "areaServed": { "@type": "Country", "name": "United States" },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "00:00",
            "closes": "23:59",
          },
          ...(industryServed && { "knowsAbout": industryServed }),
          ...(offers.length > 0 && {
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": `${name} Services`,
              "itemListElement": offers.map(o => ({
                "@type": "Offer",
                "itemOffered": { "@type": "Service", "name": o.name, "description": o.description || "" },
              })),
            },
          }),
          "parentOrganization": {
            "@type": "Organization",
            "@id": BASE.org,
            "name": "EzPay America",
            "url": BASE.site,
          },
        },
        {
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          "url": pageUrl,
          "name": `${name} | EzPay America`,
          "description": description,
          "isPartOf": { "@id": `${BASE.site}/#website` },
          "about": { "@id": BASE.org },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE.site },
              { "@type": "ListItem", "position": 2, "name": industryServed || name, "item": pageUrl },
            ],
          },
        },
      ],
    };
    injectSchema(schemaId, schema);
    return () => removeSchema(schemaId);
  }, [name, description, url, businessType, industryServed, image]);

  return null;
}