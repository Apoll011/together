"use client";

import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@repo/ui/ThemeContext";
import { Button } from "antd";

export const ToggleTheme: React.FC = () => {
  const { colors, mode, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = mode === "dark";

  const handleToggle = useCallback(() => {
    if (!buttonRef.current) return;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(y, window.innerHeight - y),
    );

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ];

    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    const transition = document.startViewTransition(() => toggleTheme());

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [toggleTheme]);

  return (
    <Button
      ref={buttonRef}
      onClick={handleToggle}
      ghost={isDark}
      style={
        isDark
          ? { borderColor: "rgba(255,255,255,0.2)", color: colors.navText }
          : {}
      }
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </Button>
  );
};
