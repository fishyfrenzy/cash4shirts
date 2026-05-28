import Script from "next/script";

// Meta + OpenAI base pixel snippets (CLAUDE.md §5). Each renders only when its
// env var is set, so the OpenAI pixel stays dark until its ID is provisioned.

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;

// Rendered near the TOP of <head> so it captures the `oppref` query param before
// any client navigation strips it.
export function OpenAIPixelHead() {
  if (!OPENAI_PIXEL_ID) return null;
  return (
    <Script id="openai-pixel" strategy="beforeInteractive">
      {`
        !function(){window.oaiq=window.oaiq||function(){(window.oaiq.q=window.oaiq.q||[]).push(arguments)};
        var s=document.createElement('script');s.async=true;
        s.src='https://js.openai.com/oai-pixel.js';
        var f=document.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);}();
        oaiq('init', '${OPENAI_PIXEL_ID}');
        oaiq('measure', 'page_view');
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
