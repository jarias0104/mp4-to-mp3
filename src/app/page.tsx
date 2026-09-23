
"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// declare global {
//   interface Window {
//     FFmpegWASM?: {
//       FFmpeg: new () => any;
//     };
//   }
// }

type LogLine = {
  text: string;
  type: "ok" | "err" | "inf" | "default";
};

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482
      0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462
      -.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832
      .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683
      -.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0
      012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028
      1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012
      2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
      6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161
      17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
      0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
      1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
      7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782
      13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0
      1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24
      22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
);

export default function Home() {
  const ffmpegRef = useRef<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "loading" | "converting" | "done" | "error"
  >("idle");

  const [logs, setLogs] = useState<LogLine[]>([
    { text: "> system ready. drop a file.", type: "inf" },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addLog = (
    text: string,
    type: LogLine["type"] = "default"
  ) => {
    setLogs((prev) => [
      ...prev.slice(-30),
      { text, type },
    ]);
  };

  const loadFFmpeg = async () => {
//     let attempts = 0;

//     // Wait for the UMD FFmpeg script to become available.
//     while (!window.FFmpegWASM?.FFmpeg && attempts < 50) {
//       await new Promise((resolve) => setTimeout(resolve, 100));
//       attempts++;
//     }

//     if (!window.FFmpegWASM?.FFmpeg) {
//       throw new Error("FFmpegWASM.FFmpeg was not loaded");
//     }

//     if (!ffmpegRef.current) {
//       ffmpegRef.current = new window.FFmpegWASM.FFmpeg();
//     }

//     const ffmpeg = ffmpegRef.current;
    
//     if (ffmpeg.loaded) return;

//     addLog("> loading ffmpeg core...", "inf");

      if(!ffmpegRef.current){
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        ffmpegRef.current = new FFmpeg();
      }

      const ffmpeg = ffmpegRef.current;

      if (!ffmpeg){
        throw new Error("Failed to create FFmpeg instance");
      }

      if (ffmpeg.loaded) return;

      addLog("> loading ffmpeg core...", "inf");
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      console.log("FFmpeg instance:", ffmpeg);
      console.log("Core URL:", `${baseURL}/ffmpeg-core.js`);
      console.log("WASM URL:", `${baseURL}/ffmpeg-core.wasm`);

try {
  const { toBlobURL } = await import("@ffmpeg/util");

const coreURL = await toBlobURL(
  `${baseURL}/ffmpeg-core.js`,
  "text/javascript"
);

const wasmURL = await toBlobURL(
  `${baseURL}/ffmpeg-core.wasm`,
  "application/wasm"
);

console.log("Blob core URL:", coreURL);
console.log("Blob WASM URL:", wasmURL);
console.log("ABOUT TO CALL ffmpeg.load()");
await ffmpeg.load({
  coreURL,
  wasmURL,
});
console.log("FFmpeg load returned!");

  console.log("FFmpeg load completed");

  addLog("> ffmpeg loaded ok.", "ok");
} catch (error) {
  console.error("FFmpeg load failed:", error);
  throw error;
}

    ffmpeg.on(
      "progress",
      ({ progress }: { progress: number }) => {
        setProgress(Math.round(progress * 100));
      }
    );

    ffmpeg.on(
      "log",
      ({ message }: { message: string }) => {
        if (
          message.startsWith("frame") ||
          message.startsWith("size")
        ) {
          return;
        }

        addLog(`  ${message}`, "default");
      }
    );

    addLog("> ffmpeg loaded ok.", "ok");
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("video/")) {
      addLog("> err: not a video file.", "err");
      return;
    }

    setFile(f);
    setProgress(0);
    setStatus("idle");

    addLog(
      `> file: ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`,
      "ok"
    );
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const convert = async () => {
    if (!file) return;

    try {
      setStatus("loading");

      await loadFFmpeg();

      setStatus("converting");
      setProgress(0);

      addLog("> starting conversion...", "inf");

      const ffmpeg = ffmpegRef.current;

      // Convert the browser File directly into Uint8Array.
      // This removes the dependency on FFmpegUtil.fetchFile().
      const fileData = new Uint8Array(
        await file.arrayBuffer()
      );

      await ffmpeg.writeFile(
        "input.mp4",
        fileData
      );

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-q:a",
        "0",
        "-map",
        "a",
        "output.mp3",
      ]);

      const data = await ffmpeg.readFile("output.mp3");

      const rawBuffer =
        data instanceof Uint8Array
          ? data.buffer.slice(
              data.byteOffset,
              data.byteOffset + data.byteLength
            )
          : data;

      const url = URL.createObjectURL(
        new Blob(
          [rawBuffer as ArrayBuffer],
          { type: "audio/mp3" }
        )
      );

      const a = document.createElement("a");

      a.href = url;
      a.download =
        file.name.replace(/\.[^.]+$/, "") + ".mp3";

      a.click();

      URL.revokeObjectURL(url);

      setStatus("done");
      setProgress(100);

      addLog(
        "> conversion complete. file downloaded.",
        "ok"
      );
    } catch (err) {
      setStatus("error");

      addLog(
        `> error: ${
          err instanceof Error
            ? err.message
            : String(err)
        }`,
        "err"
      );
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");

    addLog(
      "> reset. ready for new file.",
      "inf"
    );
  };

  const dropZoneClass = `drop-zone p-8 text-center ${
    isDragging ? "active" : ""
  } ${file ? "has-file" : ""}`;

  return (
    <div className="scanlines crt min-h-screen flex flex-col">

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div
            style={{
              color: "var(--border)",
              fontSize: "13px",
            }}
          >
            EPUKI MP4{" "}
            <span style={{ color: "var(--accent)" }}>
              --&gt;
            </span>{" "}
            MP3
          </div>

          <div
            style={{
              color: "var(--muted)",
              fontSize: "7px",
              marginTop: "4px",
            }}
          >
            pixel converter v1.0
          </div>
        </div>

        <div
          style={{
            color: "var(--accent2)",
            fontSize: "8px",
          }}
        >
          <span className="blink">_</span>
        </div>
      </header>

      {/* Main */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-6"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          width: "100%",
        }}
      >

        {/* Title block */}
        <div
          className="text-center"
          style={{ marginBottom: "8px" }}
        >
          <h1
            style={{
              fontSize: "11px",
              color: "var(--text)",
              lineHeight: 2,
            }}
          >
            AUDIO
            <br />
            <span style={{ color: "var(--accent)" }}>
              EXTRACTOR
            </span>
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "7px",
              marginTop: "8px",
            }}
          >
            client-side only. no uploads. no servers.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={dropZoneClass}
          style={{ width: "100%" }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() =>
            document
              .getElementById("fileInput")
              ?.click()
          }
        >
          <input
            id="fileInput"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onInputChange}
          />

          {file ? (
            <div>
              <div
                style={{
                  color: "var(--accent2)",
                  fontSize: "9px",
                }}
              >
                [FILE LOADED]
              </div>

              <div
                style={{
                  color: "var(--text)",
                  fontSize: "8px",
                  marginTop: "8px",
                  wordBreak: "break-all",
                }}
              >
                {file.name}
              </div>

              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "7px",
                  marginTop: "4px",
                }}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "26px",
                  marginBottom: "8px",
                  fontFamily: "monospace",
                }}
              >
                {isDragging ? "[+]" : "[ ]"}
              </div>

              <div
                style={{
                  color: isDragging
                    ? "var(--border)"
                    : "var(--muted)",
                  fontSize: "8px",
                }}
              >
                {isDragging
                  ? "drop it!"
                  : "click or drag mp4 here"}
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {(status === "converting" ||
          status === "done") && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "7px",
                  color: "var(--muted)",
                }}
              >
                PROGRESS
              </span>

              <span
                style={{
                  fontSize: "7px",
                  color: "var(--border)",
                }}
              >
                {progress}%
              </span>
            </div>

            <div className="pixel-progress-track">
              <div
                className="pixel-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Status message */}
        {status === "loading" && (
          <p
            style={{
              fontSize: "8px",
              color: "var(--border)",
            }}
          >
            &gt; loading ffmpeg wasm
            <span className="blink">_</span>
          </p>
        )}

        {status === "converting" && (
          <p
            style={{
              fontSize: "8px",
              color: "var(--accent2)",
            }}
          >
            &gt; converting
            <span className="blink">_</span>
          </p>
        )}

        {status === "done" && (
          <p
            style={{
              fontSize: "8px",
              color: "#00ff88",
            }}
          >
            &gt; done! check your downloads.
          </p>
        )}

        {status === "error" && (
          <p
            style={{
              fontSize: "8px",
              color: "var(--accent)",
            }}
          >
            &gt; conversion failed. see log.
          </p>
        )}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            className="pixel-btn pixel-btn-yellow"
            onClick={convert}
            disabled={
              !mounted ||
              !file ||
              status === "loading" ||
              status === "converting"
            }
            style={{
              opacity:
                !mounted ||
                !file ||
                status === "loading" ||
                status === "converting"
                  ? 0.4
                  : 1,
            }}
          >
            CONVERT
          </button>

          <button
            className="pixel-btn"
            onClick={reset}
          >
            RESET
          </button>
        </div>

        {/* Log window */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              fontSize: "7px",
              color: "var(--muted)",
              marginBottom: "4px",
            }}
          >
            SYS LOG
          </div>

          <div
            className="log-window"
            id="logWindow"
          >
            {logs.map((l, i) => (
              <p
                key={i}
                className={
                  l.type !== "default"
                    ? l.type
                    : ""
                }
              >
                {l.text}
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-6 py-5 border-t-2"
        style={{ borderColor: "var(--muted)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "7px",
              color: "var(--muted)",
            }}
          >
            built with ffmpeg.wasm &mdash; runs 100% in your browser
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <a
              href="https://github.com/jarias0104"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="GitHub"
            >
              <GitHubIcon />
            </a>

            <a
              href="https://x.com/epukiii"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="X / Twitter"
            >
              <TwitterIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/jeshua-arias-0b0b8232b/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

