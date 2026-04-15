import { useEffect } from "react";

export function useZoomFix() {
  useEffect(() => {
    const fix = () => {
      const zoom = window.devicePixelRatio;
      const scale = 1 / zoom;
      document.documentElement.style.setProperty("--zoom-fix", `${scale}`);
    };

    fix();
    window.addEventListener("resize", fix);
    return () => window.removeEventListener("resize", fix);
  }, []);
}
