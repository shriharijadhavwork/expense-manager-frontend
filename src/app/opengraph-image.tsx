import { ImageResponse } from "next/og";
import { appConfig } from "@/config/env";

export const alt = `${appConfig.appName} — Go live. Spend. We'll keep score.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(155deg, #e8f3ef 0%, #faf9f6 46%, #f5efe8 100%)",
          color: "#1f1f1c",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#2f6b5c",
            }}
          />
          <div style={{ display: "flex", fontWeight: 600 }}>{appConfig.appName}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            <div style={{ display: "flex" }}>Go live. Spend.</div>
            <div style={{ display: "flex" }}>We&apos;ll keep score.</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: "#5f5f58",
              maxWidth: 820,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Talk naturally about your money. FLUX understands, remembers
            context, and keeps score.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "system-ui, sans-serif",
            fontSize: 24,
            color: "#5f5f58",
          }}
        >
          <div style={{ display: "flex" }}>flux.app</div>
          <div
            style={{
              display: "flex",
              background: "#2f6b5c",
              color: "#faf9f6",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Talk to FLUX
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
