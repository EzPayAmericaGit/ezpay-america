import { useEffect } from "react";

export default function SEOHead({ title, description, keywords, image, url }) {
  
  // Set document title immediately - keep under 60 characters when possible
  if (typeof document !== 'undefined') {
    const fullTitle = title ? `${title} | EzPay America` : "EzPay America - Zero-Fee Payment Processing";
    document.title = fullTitle;
  }

  useEffect(() => {
    // Charset
    let metaCharset = document.querySelector('meta[charset]');
    if (!metaCharset) {
      metaCharset = document.createElement('meta');
      metaCharset.setAttribute('charset', 'utf-8');
      document.head.insertBefore(metaCharset, document.head.firstChild);
    }

    // Viewport
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = "viewport";
      metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0";
      document.head.appendChild(metaViewport);
    } else {
      metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0";
    }

    // Format Detection (iOS)
    let metaFormatDetection = document.querySelector('meta[name="format-detection"]');
    if (!metaFormatDetection) {
      metaFormatDetection = document.createElement('meta');
      metaFormatDetection.name = "format-detection";
      metaFormatDetection.content = "telephone=yes";
      document.head.appendChild(metaFormatDetection);
    }

    // Meta Description - keep under 155 characters
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.insertBefore(metaDescription, document.head.firstChild);
    }
    metaDescription.setAttribute('content', description || "EzPay America offers zero-fee payment processing, POS systems, and merchant services for retail and restaurant businesses across the USA.");
    
    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords || "payment processing, merchant services, POS system, credit card processing, zero fee processing, EzPay America";
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;

    // Open Graph tags for social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title || "EzPay America - Zero-Fee Payment Processing Solutions";
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = description || "Zero-fee payment processing solutions for your business.";
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.content = "website";

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = url || window.location.href;

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.content = image || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png";

    // Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.name = "twitter:card";
      document.head.appendChild(twitterCard);
    }
    twitterCard.content = "summary_large_image";

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = "twitter:title";
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = title || "EzPay America - Zero-Fee Payment Processing Solutions";

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.name = "twitter:description";
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.content = description || "Zero-fee payment processing solutions for your business.";

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.name = "twitter:image";
      document.head.appendChild(twitterImage);
    }
    twitterImage.content = image || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png";
    
    // Add JSON-LD Structured Data for Local Business
    let structuredData = document.querySelector('script[type="application/ld+json"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": "https://ezpayamerica.com/#organization",
          "name": "EzPay America",
          "alternateName": "EzPay America Inc",
          "description": description || "Zero-fee payment processing and POS systems for retail and restaurant businesses across the United States",
          "url": "https://ezpayamerica.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
            "width": 512,
            "height": 512
          },
          "image": {
            "@type": "ImageObject",
            "url": image || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png"
          },
          "telephone": "+1-865-316-9625",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressRegion": "United States"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          },
          "sameAs": [
            "https://www.facebook.com/ezpayamerica",
            "https://twitter.com/ezpayamerica"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://ezpayamerica.com/#website",
          "url": "https://ezpayamerica.com",
          "name": "EzPay America - Payment Processing Solutions",
          "publisher": {
            "@id": "https://ezpayamerica.com/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://ezpayamerica.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "WebPage",
          "@id": (url || window.location.href) + "#webpage",
          "url": url || window.location.href,
          "name": title ? `${title} | EzPay America` : "EzPay America - Zero-Fee Payment Processing",
          "isPartOf": {
            "@id": "https://ezpayamerica.com/#website"
          },
          "about": {
            "@id": "https://ezpayamerica.com/#organization"
          },
          "description": description || "Zero-fee payment processing solutions for your business",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ezpayamerica.com"
              }
            ]
          }
        },
        {
          "@type": "Service",
          "serviceType": "Payment Processing",
          "provider": {
            "@id": "https://ezpayamerica.com/#organization"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Payment Processing Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Zero-Fee Payment Processing",
                  "description": "Credit card processing with zero transaction fees for merchants"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "POS Systems",
                  "description": "Cloud-based point of sale systems for retail and restaurants"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Merchant Account Services",
                  "description": "Complete merchant account setup and support"
                }
              }
            ]
          }
        }
      ]
    };
    
    structuredData.textContent = JSON.stringify(schema);

    // Add robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = "robots";
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    // Add language meta tag
    let metaLanguage = document.querySelector('meta[http-equiv="content-language"]');
    if (!metaLanguage) {
      metaLanguage = document.createElement('meta');
      metaLanguage.setAttribute('http-equiv', 'content-language');
      document.head.appendChild(metaLanguage);
    }
    metaLanguage.content = "en-US";

    // Add theme color for mobile
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = "#F59E0B";

    // Add author meta tag
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.name = "author";
      document.head.appendChild(metaAuthor);
    }
    metaAuthor.content = "EzPay America";

    // Add geo tags for local SEO
    let metaGeoRegion = document.querySelector('meta[name="geo.region"]');
    if (!metaGeoRegion) {
      metaGeoRegion = document.createElement('meta');
      metaGeoRegion.name = "geo.region";
      metaGeoRegion.content = "US";
      document.head.appendChild(metaGeoRegion);
    }

    let metaGeoPlacename = document.querySelector('meta[name="geo.placename"]');
    if (!metaGeoPlacename) {
      metaGeoPlacename = document.createElement('meta');
      metaGeoPlacename.name = "geo.placename";
      metaGeoPlacename.content = "United States";
      document.head.appendChild(metaGeoPlacename);
    }

    // Add referrer policy
    let metaReferrer = document.querySelector('meta[name="referrer"]');
    if (!metaReferrer) {
      metaReferrer = document.createElement('meta');
      metaReferrer.name = "referrer";
      metaReferrer.content = "origin-when-cross-origin";
      document.head.appendChild(metaReferrer);
    }

    // Google verification (placeholder - user should add actual code)
    let metaGoogleVerify = document.querySelector('meta[name="google-site-verification"]');
    if (!metaGoogleVerify) {
      metaGoogleVerify = document.createElement('meta');
      metaGoogleVerify.name = "google-site-verification";
      metaGoogleVerify.content = "";
      document.head.appendChild(metaGoogleVerify);
    }
    
  }, [title, description, keywords, image, url]);

  return null;
}