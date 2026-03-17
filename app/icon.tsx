import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: "#3B82F6",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          DD
        </span>
      </div>
    ),
    { ...size }
  );
}
