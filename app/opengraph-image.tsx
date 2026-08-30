import { ImageResponse } from "next/og";

export const alt = "Shivam Singh — AI Engineer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#09090b",
          color: "#f7f8fb",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 520,
            left: -180,
            top: -250,
            background: "rgba(117, 105, 255, .28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 440,
            height: 440,
            borderRadius: 440,
            right: -170,
            bottom: -220,
            background: "rgba(100, 255, 202, .18)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#b8f6df",
                color: "#09100e",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              SS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>Shivam Singh</span>
              <span style={{ fontSize: 17, color: "#aeb4bf" }}>AI Engineer · Bangalore, India</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.16)",
              color: "#93f0cf",
              fontSize: 15,
              letterSpacing: 1,
            }}
          >
            PRODUCTION AI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 970, position: "relative" }}>
          <div style={{ fontSize: 70, lineHeight: 1.02, fontWeight: 800, letterSpacing: -3 }}>
            Building AI systems that ship, scale & solve.
          </div>
          <div style={{ marginTop: 28, fontSize: 24, lineHeight: 1.5, color: "#b7bcc6" }}>
            Generative AI · RAG · Agentic AI · VLM · MCP · Backend Systems
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {["100+ hrs saved/month", "10K+ docs/month", "80% faster HR resolution"].map((item) => (
              <span
                key={item}
                style={{
                  display: "flex",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.04)",
                  fontSize: 16,
                  color: "#d9dde4",
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 17, color: "#7f8792" }}>shivam98nitt.github.io/portfolio</span>
        </div>
      </div>
    ),
    size,
  );
}
