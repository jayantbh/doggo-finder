import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import "../styles/globals.scss";
import { ToastProvider } from "../context/providers/ToastProvider";
import { WorkerProvider } from "../context/providers/WorkerProvider";

const meta = {
  title: "Doggo Finder",
  desc: "Instant dog breed recognizer, and breed images viewer",
  image: "/doggo-finder.png",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Doggo Finder</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.desc} />

        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://doggo-finder.jay.run/" /> */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:image" content={meta.image} />

        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://doggo-finder.jay.run/" /> */}
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.desc} />
        <meta property="twitter:image" content={meta.image} />

        <link rel="shortcut icon" href="paw.png" type="image/x-icon" />
        <link rel="preload" href="paw.png" as="image" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo&display=swap"
          rel="stylesheet"
        />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FKR6SVX5HM"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-FKR6SVX5HM');`,
          }}
        />
      </Head>
      <WorkerProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </WorkerProvider>
    </>
  );
}
export default MyApp;
