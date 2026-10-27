import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
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
          backgroundColor: "#070707",
          border: "2px solid #BF953F",
          borderRadius: "12px",
          color: "#FCF6BA",
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: "-2px",
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
