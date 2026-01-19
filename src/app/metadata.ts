import { Metadata } from "next";

export const siteMetadata: Metadata = {
    title: "Cash 4 Shirts | Sell Vintage Harley & Concert T-Shirts for Cash",
    description: "Where can I sell my old concert shirts for cash today? We buy vintage 70s-90s Harley Davidson and concert t-shirts. Fast cash offers, free pickup in Indiana and Florida.",
    keywords: [
        "sell Harley shirts locally Indianapolis",
        "vintage concert t-shirt resale value",
        "consignment shops Indianapolis vintage",
        "3D Emblem Harley value",
        "single-stitch identification",
        "original owner t-shirt hauls",
        "Screen Stars tags",
        "Blue Bar tags",
        "dry rot testing"
    ],
    authors: [{ name: "Cash 4 Shirts" }],
    openGraph: {
        title: "Cash 4 Shirts | Sell Vintage Harley & Concert T-Shirts for Cash",
        description: "Turn your vintage 70s-90s Harley Davidson and concert t-shirts into cash. Fast, fair offers in Indiana and Florida.",
        type: "website",
        locale: "en_US",
        siteName: "Cash 4 Shirts",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Cash 4 Shirts - Sell Vintage T-Shirts"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Cash 4 Shirts | Sell Vintage Harley & Concert T-Shirts",
        description: "Where can I sell my old concert shirts for cash today? Fast offers in Indiana & Florida.",
    },
    robots: {
        index: true,
        follow: true,
    }
};
