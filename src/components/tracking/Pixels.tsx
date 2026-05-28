import Script from "next/script";

// Meta + OpenAI base pixel snippets (CLAUDE.md §5). Each renders only when its
// env var is set, so the OpenAI pixel stays dark until its ID is provisioned.

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;

// OpenAI/ChatGPT Ads pixel — official setup snippet (one per page, in <head>).
// The conversion event ("registration_completed") fires on the thank-you page
// via trackLead(), not here.
export function OpenAIPixelHead() {
  if (!OPENAI_PIXEL_ID) return null;
  return (
    <Script id="openai-pixel" strategy="beforeInteractive">
      {`
        !function(w, d, s, u) {
          if (w.oaiq) return;
          var q = function() { q.q.push(arguments); };
          q.q = [];
          w.oaiq = q;
          var j = d.createElement(s);
          j.async = 1;
          j.src = u;
          var f = d.getElementsByTagName(s)[0];
          f.parentNode.insertBefore(j, f);
        }(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
        oaiq("init", { pixelId: "${OPENAI_PIXEL_ID}", debug: ${process.env.NODE_ENV !== "production"} });
      `}
    </Script>
  );
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
