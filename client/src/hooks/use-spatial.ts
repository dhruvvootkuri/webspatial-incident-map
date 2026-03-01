import { useState, useEffect, useCallback, useRef } from "react";

export function useIsSpatial(): boolean {
  const [isSpatial, setIsSpatial] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsSpatial(document.documentElement.classList.contains("is-spatial"));
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isSpatial;
}

export function useSpatialElement(ref: React.RefObject<HTMLElement | null>, options: {
  enabled: boolean;
  back?: number;
  backgroundMaterial?: string;
}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (options.enabled) {
      el.setAttribute("enable-xr", "");
      if (options.back) {
        el.style.setProperty("--xr-back", `${options.back}px`);
      }
      if (options.backgroundMaterial) {
        el.style.setProperty("--xr-background-material", options.backgroundMaterial);
      }
    } else {
      el.removeAttribute("enable-xr");
      el.style.removeProperty("--xr-back");
      el.style.removeProperty("--xr-background-material");
    }

    return () => {
      el.removeAttribute("enable-xr");
      el.style.removeProperty("--xr-back");
      el.style.removeProperty("--xr-background-material");
    };
  }, [ref, options.enabled, options.back, options.backgroundMaterial]);
}

export function useOpenSpatialScene() {
  const isSpatial = useIsSpatial();

  const openScene = useCallback((name: string, url: string, width = 900, height = 600) => {
    if (!isSpatial) return false;

    try {
      const initScene = (window as any).__webspatial?.initScene;
      if (initScene) {
        initScene(name, (opts: any) => ({
          ...opts,
          url,
          size: { width, height },
          style: {
            cornerRadius: 20,
            material: "glass.thick",
          },
        }));
        return true;
      }
    } catch (e) {
      console.warn("WebSpatial scene creation failed:", e);
    }
    return false;
  }, [isSpatial]);

  return { isSpatial, openScene };
}
