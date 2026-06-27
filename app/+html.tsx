import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// Web-only HTML shell for the static export. Adds the MapLibre GL stylesheet
// (required for the interactive 3D map) and standard responsive viewport setup.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { height: 100%; }
          body { overflow: hidden; }
          #root { display: flex; height: 100%; flex: 1; }
          .maplibregl-popup-content {
            border-radius: 14px;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(10,22,40,0.25);
          }
          .maplibregl-popup-close-button { font-size: 18px; padding: 2px 8px; color: #fff; z-index: 2; }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
