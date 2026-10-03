"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frameId: number | null = null;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;

    const hidePointer = () => {
      root.style.setProperty("--pointer-opacity", "0");
    };

    const renderPointer = () => {
      root.style.setProperty("--pointer-x", `${pointerX}px`);
      root.style.setProperty("--pointer-y", `${pointerY}px`);
      frameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion.matches) {
        hidePointer();
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;

      root.style.setProperty("--pointer-opacity", "1");

      if (frameId === null) {
        frameId = window.requestAnimationFrame(renderPointer);
      }
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion.matches) {
        hidePointer();
        return;
      }

      root.style.setProperty("--pointer-opacity", "1");
    };

    const handlePointerLeave = () => {
      hidePointer();
    };

    const handleMotionPreferenceChange = () => {
      if (reducedMotion.matches) {
        hidePointer();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerenter",
      handlePointerEnter,
    );

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    reducedMotion.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("pointermove", handlePointerMove);

      document.documentElement.removeEventListener(
        "pointerenter",
        handlePointerEnter,
      );

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);

      hidePointer();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2147483647] hidden overflow-hidden md:block"
    >
      <div className="cursor-core" />
    </div>
  );
}
