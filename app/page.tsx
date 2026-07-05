"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  const checkWebsite = () => {
    if (!url.trim()) {
      alert("Please enter a website URL");
      return;
    }

    const website = url.toLowerCase();

    if (
      website.includes("google.com") ||
      website.includes("github.com") ||
      website.includes("amazon.com") ||
      website.includes("microsoft.com") ||
      website.includes("apple.com") ||
      website.includes("youtube.com") ||
      website.includes("openai.com") ||
      website.includes("linkedin.com")
    ) {
      setResult("✅ SAFE WEBSITE");
    } else if (
      website.includes("free") ||
      website.includes("gift") ||
      website.includes("bonus") ||
      website.includes("win") ||
      website.includes("verify") ||
      website.includes("crypto")
    ) {
      setResult("❌ HIGH RISK - POSSIBLE SCAM");
    } else {
      setResult("⚠️ UNKNOWN WEBSITE");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <Image
            src="/logo.png"
            alt="HoaxShield logo"
            width={90}
            height={90}
          />

          <h1
            style={{
              fontSize: "72px",
              margin: 0,
              background:
                "linear-gradient(90deg,#ffffff,#00b4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            HoaxShield
          </h1>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "24px",
            color: "#b8c5d3",
            marginTop: "10px",
            marginBottom: "40px",
          }}
        >
          AI-Powered Scam & Phishing Website Detection
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Website URL (https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              flex: 1,
              padding: "22px",
              fontSize: "18px",
              borderRadius: "15px",
              background: "#111c2e",
              color: "white",
              border: "2px solid #1d72ff",
              outline: "none",
            }}
          />

          <button
            onClick={checkWebsite}
            style={{
              width: "260px",
              border: "none",
              borderRadius: "15px",
              background: "#1877ff",
              color: "white",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔍 Check Website
          </button>
        </div>

        <div
          style={{
            marginTop: "40px",
            background: "#111c2e",
            borderRadius: "20px",
            border: "1px solid #26354d",
            padding: "50px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "65px",
            }}
          >
            🛡️
          </div>

          <h2
            style={{
              fontSize: "36px",
              marginTop: "10px",
            }}
          >
            {result || "Result will appear here"}
          </h2>

          <p
            style={{
              color: "#b8c5d3",
              fontSize: "18px",
            }}
          >
            Enter a website URL and click "Check Website"
          </p>
        </div>

        <div
          style={{
            marginTop: "35px",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
          }}
        >
          {[
            ["🛡️", "Real-time Analysis"],
            ["🤖", "AI Detection"],
            ["⚡", "Instant Results"],
            ["🔒", "Stay Safe Online"],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{
                background: "#111c2e",
                padding: "25px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #26354d",
              }}
            >
              <div style={{ fontSize: "35px" }}>{icon}</div>

              <h3
                style={{
                  marginTop: "15px",
                }}
              >
                {text}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
