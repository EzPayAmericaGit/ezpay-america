import { useEffect } from "react";

export default function SEOHead({ title, description, keywords, image, url, articleSchema, pageSchema }) {
  
  // Set document title immediately - Google recommends 50-60 characters
  if (typeof document !== 'undefined') {
    const fullTitle = title ? `${title} | EzPay America` : "EzPay America - Zero-Fee Payment Processing";
    // Ensure title is under 60 characters for optimal display
    document.title = fullTitle.length > 60 ? fullTitle.substring(0, 57) + '...' : fullTitle;
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

    // Meta Description - Google recommends 150-160 characters for optimal display
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.insertBefore(metaDescription, document.head.firstChild);
    }
    const finalDescription = description || "EzPay America: zero-fee credit card processing & merchant services for small business. No monthly fees, no contracts, free POS equipment. Best Square & PayPal alternative. Apply online today.";
    // Ensure description is 150-160 characters for best SERP display
    metaDescription.setAttribute('content', finalDescription.length > 160 ? finalDescription.substring(0, 157) + '...' : finalDescription);
    
    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords || "payment processing, merchant services, credit card processing, payment gateway, online payment processing, best payment processor for small business, affordable credit card processing for small business, no monthly fee payment processing, lowest cost credit card processing, restaurant payment processing, retail payment solutions, mobile payment processing for small business, ACH payment processing, recurring payment processing, payment processing no setup fee, same day deposit payment processing, virtual terminal payment processor, PCI compliant payment processing, no contract payment processing, zero fee credit card processing, transparent pricing payment processor, no hidden fees payment processing, high risk merchant account, cbd payment processing, chargeback protection services, merchant services near me, how much does credit card processing cost, what is interchange plus pricing, alternative to Square for small business, PayPal alternative for merchants, Square alternative high volume, best payment processor comparison, EzPay America, point of sale system, POS system small business, retail POS, restaurant POS, food truck payment processing, grocery store POS, EMV chip reader, NFC payments, Apple Pay Google Pay, interchange plus pricing, merchant cash advance, payment processing USA";
    
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
                  "name": "Zero-Fee Credit Card Processing",
                  "description": "No-fee credit card processing for small businesses — merchants pay $0 in transaction fees with no monthly or setup charges"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Restaurant POS System",
                  "description": "Cloud-based POS system for restaurants, cafes, food trucks, bars, and delis with integrated payment processing"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Retail POS System",
                  "description": "Point of sale system for retail stores, grocery stores, liquor stores, and specialty shops"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Merchant Account Services",
                  "description": "Complete merchant account setup, ACH processing, virtual terminal, and recurring payment solutions"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Merchant Cash Advance",
                  "description": "Fast business funding through merchant cash advance programs for qualifying merchants"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Mobile Payment Processing",
                  "description": "Mobile payment processing solutions for small businesses, food trucks, and on-the-go merchants"
                }
              }
            ]
          }
        }
      ]
    };
    
    // If a per-page schema override is provided, merge it into the @graph
    if (pageSchema && Array.isArray(pageSchema)) {
      schema["@graph"] = [...schema["@graph"], ...pageSchema];
    }

    structuredData.textContent = JSON.stringify(schema);

    // Add Article/BlogPosting schema when articleSchema prop is provided
    let articleStructuredData = document.querySelector('script[data-schema="article"]');
    if (articleSchema) {
      if (!articleStructuredData) {
        articleStructuredData = document.createElement('script');
        articleStructuredData.type = 'application/ld+json';
        articleStructuredData.setAttribute('data-schema', 'article');
        document.head.appendChild(articleStructuredData);
      }
      const articleUrl = `https://ezpayamerica.com/news/${articleSchema.slug || articleSchema.id}`;
      articleStructuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": articleSchema.headline,
        "description": articleSchema.description,
        "image": articleSchema.image ? [articleSchema.image] : [],
        "datePublished": articleSchema.datePublished,
        "dateModified": articleSchema.dateModified || articleSchema.datePublished,
        "author": {
          "@type": "Organization",
          "name": "EzPay America",
          "url": "https://ezpayamerica.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "EzPay America",
          "logo": {
            "@type": "ImageObject",
            "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png"
          }
        },
        "url": articleUrl,
        "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
        "articleSection": articleSchema.category,
        "keywords": `${articleSchema.category}, EzPay America, payment processing`
      });
    } else if (articleStructuredData) {
      articleStructuredData.remove();
    }

    // Add FAQ Schema for common questions (helps with featured snippets)
    let faqSchema = document.querySelector('script[data-schema="faq"]');
    if (!faqSchema) {
      faqSchema = document.createElement('script');
      faqSchema.type = 'application/ld+json';
      faqSchema.setAttribute('data-schema', 'faq');
      document.head.appendChild(faqSchema);
    }
    
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is zero-fee payment processing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Zero-fee payment processing allows merchants to accept credit card payments without paying any transaction fees themselves. The small processing cost is passed to the customer as a transparent service fee, saving the business owner hundreds or thousands of dollars per year."
          }
        },
        {
          "@type": "Question",
          "name": "How much does credit card processing cost with EzPay America?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "With EzPay America's zero-fee program, merchants pay $0 in credit card processing fees. There are no monthly fees, no setup fees, and no long-term contracts. The processing cost is covered by a small customer service fee, making EzPay America the most affordable payment processor for small businesses."
          }
        },
        {
          "@type": "Question",
          "name": "Is EzPay America a good alternative to Square or PayPal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Unlike Square or PayPal which charge 2.6–3.5% per transaction, EzPay America offers zero-fee processing with no contracts, free POS equipment, and dedicated personal support. It is an ideal Square alternative for high-volume businesses and a better PayPal alternative for merchants who want lower rates and no monthly fees."
          }
        },
        {
          "@type": "Question",
          "name": "What types of businesses does EzPay America serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "EzPay America serves retail stores, restaurants, cafes, bars, food trucks, grocery stores, liquor stores, CBD stores, vape shops, bagel shops, delis, gift shops, and various specialty businesses across the United States with tailored POS systems and payment processing solutions."
          }
        },
        {
          "@type": "Question",
          "name": "Does EzPay America offer ACH payment processing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. EzPay America supports ACH payment processing, recurring payments, and virtual terminal solutions in addition to in-person credit and debit card processing. Contact us at (865) 316-9625 to learn more."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get started with EzPay America?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Getting started is simple. Apply online in minutes, take our business quiz to find the right solution, or call (865) 316-9625 to speak with a payment specialist. There are no contracts and free equipment is included."
          }
        },
        {
          "@type": "Question",
          "name": "What is the cheapest payment processor for small business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "EzPay America is one of the cheapest payment processors for small businesses because merchants pay zero transaction fees. With no monthly fees, no setup fees, and no contracts, it offers transparent pricing that saves small businesses significantly compared to Square, Stripe, or PayPal."
          }
        },
        {
          "@type": "Question",
          "name": "Does EzPay America offer payment processing without a contract?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. EzPay America offers no-contract payment processing. You are never locked in, and there are no cancellation fees, giving small business owners complete flexibility."
          }
        }
      ]
    };
    
    faqSchema.textContent = JSON.stringify(faqData);

    // Robots meta - Google recommends being explicit about crawling preferences
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = "robots";
      document.head.appendChild(metaRobots);
    }
    // Allow Google to show rich previews (images, snippets, videos)
    metaRobots.content = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    
    // Add Googlebot specific meta
    let metaGooglebot = document.querySelector('meta[name="googlebot"]');
    if (!metaGooglebot) {
      metaGooglebot = document.createElement('meta');
      metaGooglebot.name = "googlebot";
      document.head.appendChild(metaGooglebot);
    }
    metaGooglebot.content = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    // Add language meta tag and HTML lang attribute (critical for accessibility and SEO)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = "en-US";
    }
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

    
  }, [title, description, keywords, image, url, articleSchema]);

  return null;
}