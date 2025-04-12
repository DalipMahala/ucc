// components/GoogleAnalytics.tsx
import React from 'react';

const GoogleAnalytics = () => {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-H2P0YD56EV" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H2P0YD56EV');
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;