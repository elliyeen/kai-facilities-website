import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.18em",
            lineHeight: 1,
          }}
        >
          KAI
        </div>
        <div
          style={{
            width: 18,
            height: 1,
            background: "rgba(255,255,255,0.55)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
