import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050507",
          borderRadius: "110px",
          border: "16px solid #C5A059",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 310,
            fontWeight: 900,
            color: "#EFE2BA",
            fontFamily: "sans-serif",
            letterSpacing: "-0.06em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
