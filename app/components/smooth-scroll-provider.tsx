"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot() {
  return activeLenis;
}

function notify() {
  subscribers.forEach((callback) => callback());
}

export function useLenis() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: !prefersReducedMotion,
      syncTouch: !prefersReducedMotion,
      lerp: prefersReducedMotion ? 1 : 0.1,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    activeLenis = lenis;
    notify();

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      if (activeLenis === lenis) {
        activeLenis = null;
        notify();
      }
    };
  }, []);

  return children;
}
