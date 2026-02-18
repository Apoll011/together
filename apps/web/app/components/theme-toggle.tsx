"use client";

import { useCallback, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { Button } from "antd";

export const ToggleTheme: React.FC = () => {
  const { colors, mode, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = mode === "dark";

  const handleToggle = useCallback(() => {
    if (!buttonRef.current) return;

    toggleTheme();

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: "ease-in-out",
      },
    );
  }, [toggleTheme]);

  return (
    <Button
      ref={buttonRef}
      onClick={handleToggle}
      ghost={isDark}
      style={isDark       ? {     borderColor: "rgba(255,255,255,0.2)",
                        color: colors.navText,
                      }
                    : {}
                }
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </Button>
  );
};
