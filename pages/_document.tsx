import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function  Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="unsafe-none" />
     {/* Google Maps API Script */}
     {/* <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDiY4TiKIhXraPLCfY898nYjMpxxQ3Gxig&libraries=places&loading=async&callback=Function.prototype`}
          strategy="afterInteractive"
        /> */}
      </Head>
      <body className="font-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

