"use client";

import { ReactNode } from "react";
import NoiseBackground from "./NoiseBackground";
import DottedGridBackground from "./DottedGridBackground";
import BackgroundRipple from "./BackgroundRipple";

interface LandingLayoutProps {
  children: ReactNode;
  showNoise?: boolean;
  showDottedGrid?: boolean;
  showRipple?: boolean;
}

export default function LandingLayout({
  children,
  showNoise = true,
  showDottedGrid = true,
  showRipple = true,
}: LandingLayoutProps) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {showNoise && <NoiseBackground opacity={0.025} mixBlendMode="overlay" />}
      {showDottedGrid && (
        <DottedGridBackground
          gridSize={40}
          dotSize={1.5}
          glowIntensity={0.6}
          glowColor="rgba(20, 184, 166, {alpha})"
          baseColor="rgba(150, 150, 160, {alpha})"
        />
      )}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
      {showRipple && <BackgroundRipple cellSize={60} maxOpacity={0.15} />}
    </div>
  );
}
