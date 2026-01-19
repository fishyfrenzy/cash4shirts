import React from "react";

export default function JSONLD() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "@id": "https://cash4shirts.com/#organization",
                "name": "Cash 4 Shirts",
                "image": "https://cash4shirts.com/logo.png",
                "description": "Where can I sell my old concert shirts for cash today? We buy vintage Harley Davidson and concert t-shirts locally in Indiana and Florida.",
                "url": "https://cash4shirts.com",
                "telephone": "+1-555-SHIRTS",
                "address": [
                    {
                        "@type": "PostalAddress",
                        "addressLocality": "Indianapolis",
                        "addressRegion": "IN",
                        "addressCountry": "US"
                    },
                    {
                        "@type": "PostalAddress",
                        "addressLocality": "Statewide",
                        "addressRegion": "FL",
                        "addressCountry": "US"
                    }
                ],
                "areaServed": [
                    {
                        "@type": "State",
                        "name": "Indiana"
                    },
                    {
                        "@type": "State",
                        "name": "Florida"
                    }
                ],
                "priceRange": "$$",
                "paymentAccepted": "Cash, PayPal, Venmo, Zelle",
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "00:00",
                    "closes": "23:59"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How much is my 80s Harley-Davidson shirt worth?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Authentic 1980s Harley-Davidson t-shirts typically value between $40 and $150, though rare 3D Emblem labels or licensed graphics can exceed $300. Key value drivers include single-stitch hems and Screen Stars or Blue Bar tags."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is selling vintage shirts for cash a scam?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No, selling to established local buyers like Cash 4 Shirts is a safe, professional alternative to the high fees and risks associated with online marketplaces like eBay or Depop."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is single-stitch and why is it valuable?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Single-stitch refers to a single row of stitching on the hems, a standard for shirts made before 1994. It is a primary indicator of authentic vintage age and higher resale value."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
