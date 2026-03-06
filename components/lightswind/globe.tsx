"use client";
import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// Utility function to convert a hex color string to a normalized RGB array
const hexToRgbNormalized = (hex: string): [number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;

  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    // console.warn(`Invalid hex color: ${hex}. Falling back to black.`);
    return [0, 0, 0];
  }

  return [r / 255, g / 255, b / 255];
};

interface GlobeProps {
  className?: string;
  theta?: number | MotionValue<number>;
  phi?: number | MotionValue<number>;
  dark?: number;
  scale?: number;
  diffuse?: number;
  mapSamples?: number;
  mapBrightness?: number;
  baseColor?: [number, number, number] | string;
  markerColor?: [number, number, number] | string;
  glowColor?: [number, number, number] | string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

const Globe: React.FC<GlobeProps> = ({
  className,
  theta = 0,
  phi = 0,
  dark = 0,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 60000,
  mapBrightness = 10,
  baseColor = "#ffffff",
  markerColor = "#ffffff",
  glowColor = "#ffffff",
  autoRotate = true,
  autoRotateSpeed = 0.003,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);

  const initialPhi = typeof phi === 'number' ? phi : phi.get();
  const initialTheta = typeof theta === 'number' ? theta : theta.get();

  const phiRef = useRef(initialPhi);
  const thetaRef = useRef(initialTheta);

  // Sync refs with props without triggering re-init
  useEffect(() => {
    if (typeof phi === 'number') {
      phiRef.current = phi;
    } else {
      return phi.on("change", (v) => {
        phiRef.current = v;
      });
    }
  }, [phi]);

  useEffect(() => {
    if (typeof theta === 'number') {
      thetaRef.current = theta;
    } else {
      return theta.on("change", (v) => {
        thetaRef.current = v;
      });
    }
  }, [theta]);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resolvedBaseColor: [number, number, number] =
      typeof baseColor === "string"
        ? hexToRgbNormalized(baseColor)
        : baseColor || [0.4, 0.6509, 1];

    const resolvedMarkerColor: [number, number, number] =
      typeof markerColor === "string"
        ? hexToRgbNormalized(markerColor)
        : markerColor || [1, 0, 0];

    const resolvedGlowColor: [number, number, number] =
      typeof glowColor === "string"
        ? hexToRgbNormalized(glowColor)
        : glowColor || [0.2745, 0.5765, 0.898];

    const initGlobe = () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }

      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height, 800);
      const devicePixelRatio = window.devicePixelRatio || 1;
      const internalWidth = size * devicePixelRatio;
      const internalHeight = size * devicePixelRatio;

      canvas.width = internalWidth;
      canvas.height = internalHeight;

      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: devicePixelRatio,
        width: internalWidth,
        height: internalHeight,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: dark,
        scale: scale,
        diffuse: diffuse,
        mapSamples: mapSamples,
        mapBrightness: mapBrightness,
        baseColor: resolvedBaseColor,
        markerColor: resolvedMarkerColor,
        glowColor: resolvedGlowColor,
        opacity: 1,
        offset: [0, 0],
        markers: [],
        onRender: (state: Record<string, any>) => {
          if (!isDragging.current && autoRotate) {
            phiRef.current += autoRotateSpeed;
          }
          state.phi = phiRef.current;
          state.theta = thetaRef.current;
        },
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastMouseX.current;
        const deltaY = e.clientY - lastMouseY.current;
        const rotationSpeed = 0.005;

        phiRef.current += deltaX * rotationSpeed;
        thetaRef.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, thetaRef.current - deltaY * rotationSpeed)
        );

        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = "grab";
      }
    };

    initGlobe();

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const handleResize = () => {
      initGlobe();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [
    dark,
    scale,
    diffuse,
    mapSamples,
    mapBrightness,
    baseColor,
    markerColor,
    glowColor,
    autoRotate,
    autoRotateSpeed,
  ]);

  return (
    <div className={cn("flex items-center justify-center z-[10] mx-auto", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full aspect-square cursor-grab"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default Globe;
