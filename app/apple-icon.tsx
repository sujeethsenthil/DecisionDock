import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 80,
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
