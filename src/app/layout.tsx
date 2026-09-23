import type { Metadata } from "next";
import "./globals.css";
// import Script from "next/script";

export const metadata: Metadata = {
  title: "Epuki",
  description: "Client-side MP4 to MP3 converter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <Script
          src="https://unpkg.com/@ffmpeg/ffmpeg@0.12.15/dist/umd/ffmpeg.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://unpkg.com/@ffmpeg/util@0.12.2/dist/umd/index.js"
          strategy="beforeInteractive"
        /> */}
        {children}
      </body>
    </html>
  );
}