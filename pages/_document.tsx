import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <body className="font-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

