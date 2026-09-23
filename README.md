MP4 → MP3 Converter

A client-side MP4 to MP3 converter built with Next.js and FFmpeg.wasm. No servers, no file uploads, no cloud — everything runs directly in the browser.

Show Image Show Image Show Image

Features
Converts MP4 video files to MP3 audio entirely in the browser
Drag and drop or click to upload
Real-time conversion progress bar
System log window showing FFmpeg output
Pixel art UI with CRT scanline effect
Zero backend — deployable to Vercel as a static site
Tech Stack
Next.js 15 — React framework
FFmpeg.wasm — FFmpeg compiled to WebAssembly, runs in the browser
Tailwind CSS — utility-first styling
Press Start 2P — pixel art font via Google Fonts
Getting Started
Prerequisites
Node.js 18+
npm
Installation
bash
# Clone the repo
git clone https://github.com/jarias0104/mp4-to-mp3.git
cd mp4-to-mp3

# Install dependencies
npm install

# Start the dev server
npm run dev

Open http://localhost:3000 in your browser.

How It Works
User drops or selects an MP4 file
FFmpeg.wasm loads its core from a CDN (first use only, then cached by the browser)
The conversion runs entirely in the browser using WebAssembly
The resulting MP3 is downloaded directly — no file ever leaves the user's device
Why no backend?

FFmpeg.wasm compiles the full FFmpeg binary to WebAssembly, allowing it to run inside a browser tab. This means:

No server costs
No file size limits imposed by a backend
Complete privacy — files never leave the user's machine
Deployable to any static hosting platform
Deployment
Vercel (recommended)
bash
npm install -g vercel
vercel

The required Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers are configured in both next.config.ts (local dev) and vercel.json (production). These headers are required for SharedArrayBuffer, which FFmpeg.wasm depends on.

Required headers
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

These are already set up in the project — no extra configuration needed.

Project Structure
mp4-to-mp3/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout, loads FFmpeg CDN scripts
│       ├── page.tsx        # Main converter UI and logic
│       └── globals.css     # Pixel art design system
├── next.config.ts          # COOP/COEP headers + Turbopack config
├── vercel.json             # Production headers for Vercel
└── README.md
Browser Support

Requires a browser that supports WebAssembly and SharedArrayBuffer:

Browser	Supported
Chrome 92+	yes
Firefox 90+	yes
Edge 92+	yes
Safari 15.2+	yes
License

MIT

Built by @jarias0104