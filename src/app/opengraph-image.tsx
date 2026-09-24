import { ImageResponse } from "next/og";

export const alt =
  "QHQ Motors — automatic car rental in Chenab Nagar (Rabwah), Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 20% 10%, #151d33 0%, #04060d 55%), #04060d",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: "rgba(229, 174, 60, 0.18)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              border: "3px solid #e5ae3c",
              background: "#0a1020",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 800,
              color: "#ecc464",
            }}
          >
            Q
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
              QHQ <span style={{ color: "#e5ae3c" }}>MOTORS</span>
            </div>
            <div
              style={{
                fontSize: 20,
                letterSpacing: 6,
                color: "#94a3b8",
                marginTop: 6,
              }}
            >
              CHENAB NAGAR · RABWAH
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>
            Automatic Car Rental in
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ecc464",
            }}
          >
            Chenab Nagar (Rabwah)
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#cbd5e1",
              marginTop: 24,
              display: "flex",
              gap: 28,
            }}
          >
            <span>from Rs 3,800/day</span>
            <span>·</span>
            <span>Free delivery</span>
            <span>·</span>
            <span>24/7 WhatsApp booking</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
