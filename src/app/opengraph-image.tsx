import { ImageResponse } from "next/og";

export const alt = "Krish Jindal — Software, AI & Robotics Engineering Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
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
          backgroundColor: "#F5F5F3",
          color: "#111111",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          border: "1px solid #DDDDDD",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #DDDDDD",
            paddingBottom: "24px",
            fontSize: 20,
            color: "#666666",
            letterSpacing: "0.14em",
          }}
        >
          <span>KRISH JINDAL</span>
          <span>ENGINEERING PORTFOLIO / 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: "960px",
            }}
          >
            Building intelligent systems that interact with the real world.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#666666",
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            Robotics · Artificial Intelligence · Computer Vision · Software Engineering
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #DDDDDD",
            paddingTop: "24px",
            fontSize: 18,
            color: "#666666",
          }}
        >
          <span>Dronacharya College of Engineering · B.Tech CSE</span>
          <span>SYSTEM / 001</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

