import React, { useEffect, useRef, useState } from 'react';

export interface MouseSpotlightProps {
  /** Spotlight radial gradient radius in pixels. Default is 320. */
  radius?: number;
  /** Optional filter blur intensity in pixels. Default is 0 (uses soft radial gradient). */
  blur?: number;
  /** Maximum opacity level for the spotlight (0.0 to 1.0). Default is 0.85. */
  opacity?: number;
  /** Primary RGB color channels for the glow (e.g., '37, 99, 235' or '59, 130, 246'). Default is '37, 99, 235'. */
  glowColor?: string;
  /** Secondary RGB accent channels for subtle color depth. Default is '14, 165, 233'. */
  accentColor?: string;
  /** Smoothing interpolation speed factor (0.01 to 0.2). Default is 0.08. */
  animationSpeed?: number;
  /** Custom z-index class or additional tailwind classes. Default is 'z-20'. */
  className?: string;
}

/**
 * Premium 60 FPS Mouse Cursor Spotlight / Glow Effect
 *
 * Built with requestAnimationFrame, Lerp motion interpolation, GPU-accelerated styling,
 * touch-device detection, and prefers-reduced-motion accessibility compliance.
 */
export const MouseSpotlight: React.FC<MouseSpotlightProps> = ({
  radius = 320,
  blur = 0,
  opacity = 0.85,
  glowColor = '37, 99, 235',
  accentColor = '14, 165, 233',
  animationSpeed = 0.08,
  className = 'z-20',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Motion physics references (bypasses React state to eliminate re-renders)
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const isHovered = useRef(false);
  const currentOpacity = useRef(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // 1. Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 2. Mobile / Touch device check
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) {
      setIsDisabled(true);
      return;
    }

    let animFrameId: number;

    // Mouse Movement Handlers
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isHovered.current) {
        isHovered.current = true;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
    };

    // 60 FPS RAF Physics Loop with Lerp (Linear Interpolation)
    const renderLoop = () => {
      // Lerp Position
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * animationSpeed;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * animationSpeed;

      // Lerp Opacity for smooth fade-in / fade-out
      const targetOpacity = isHovered.current ? opacity : 0;
      currentOpacity.current += (targetOpacity - currentOpacity.current) * (animationSpeed * 1.5);

      if (spotlightRef.current) {
        const x = currentPos.current.x;
        const y = currentPos.current.y;
        const currentOp = currentOpacity.current;

        // Apply direct DOM style modifications for zero-lag 60fps execution
        spotlightRef.current.style.opacity = currentOp.toFixed(3);
        spotlightRef.current.style.background = `radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(255, 255, 255, 0) 0%, rgba(${glowColor}, 0.12) 35%, rgba(${accentColor}, 0.05) 60%, rgba(${glowColor}, 0) 80%)`;
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    // Attach Event Listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Initialize animation loop
    animFrameId = requestAnimationFrame(renderLoop);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, [radius, opacity, glowColor, accentColor, animationSpeed]);

  if (isDisabled) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    >
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-all duration-75 ease-out"
        style={{
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          willChange: 'background, opacity',
        }}
      />
    </div>
  );
};
