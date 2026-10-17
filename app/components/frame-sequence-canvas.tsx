"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import frameManifest from "../generated/frame-manifest.json";
import sequenceConfig from "../lib/villa-sequence-config.json";
import { useLenis } from "./smooth-scroll-provider";

gsap.registerPlugin(ScrollTrigger);

const PRELOAD_RADIUS = 12;
const LOAD_CONCURRENCY = 3;
const MAX_CACHED_DESKTOP_FRAMES = 30;
const MAX_CACHED_MOBILE_FRAMES = 18;

const scenes = sequenceConfig.scenes;
const totalFrames = frameManifest.frames.length;
const sourceDurationSeconds = frameManifest.sourceDurationSeconds;

function clampProgress(progress: number) {
  return Math.max(0, Math.min(1, progress));
}

function frameForProgress(progress: number) {
  return Math.round(clampProgress(progress) * (totalFrames - 1));
}

function sceneForProgress(progress: number) {
  const timestamp = clampProgress(progress) * sourceDurationSeconds;
  const index = scenes.findIndex(
    (scene, sceneIndex) =>
      timestamp >= scene.startSeconds &&
      (timestamp < scene.endSeconds || sceneIndex === scenes.length - 1),
  );
  return index === -1 ? scenes.length - 1 : index;
}

export default function FrameSequenceCanvas() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomInnerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const cacheRef = useRef(new Map<number, HTMLImageElement>());
  const failedFramesRef = useRef(new Set<number>());
  const requestFramesRef = useRef<(frame: number, direction: number) => void>(() => {});
  const currentFrameRef = useRef(0);
  const activeSceneRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const latestProgressRef = useRef(0);
  const renderRequestRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [sequenceActive, setSequenceActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [unavailableFrameCount, setUnavailableFrameCount] = useState(0);

  const drawFrame = useCallback((index: number, loadedImage?: HTMLImageElement) => {
    if (renderedFrameRef.current === index) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = loadedImage ?? cacheRef.current.get(index);
    if (!image || image.naturalWidth === 0) return;

    const context = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!context || !width || !height) return;

    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;

    context.clearRect(0, 0, width, height);
    context.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
    renderedFrameRef.current = index;
    canvas.dataset.frameIndex = String(index);
    canvas.dataset.frameNumber = String(frameManifest.frames[index]?.frameNumber ?? index + 1);
  }, []);

  const scheduleScrollRender = useCallback(
    (progress: number) => {
      latestProgressRef.current = clampProgress(progress);
      if (renderRequestRef.current) return;

      renderRequestRef.current = requestAnimationFrame(() => {
        renderRequestRef.current = 0;
        const frame = frameForProgress(latestProgressRef.current);
        const previousFrame = currentFrameRef.current;

        if (frame !== previousFrame || renderedFrameRef.current === -1) {
          const cachedImage = cacheRef.current.get(frame);
          if (cachedImage) {
            cacheRef.current.delete(frame);
            cacheRef.current.set(frame, cachedImage);
            drawFrame(frame, cachedImage);
          } else {
            let nearestFrame = -1;
            let nearestDistance = Number.POSITIVE_INFINITY;
            for (const cachedIndex of cacheRef.current.keys()) {
              const distance = Math.abs(cachedIndex - frame);
              if (distance < nearestDistance) {
                nearestFrame = cachedIndex;
                nearestDistance = distance;
              }
            }
            if (nearestFrame !== -1) {
              const nearestImage = cacheRef.current.get(nearestFrame);
              if (nearestImage) drawFrame(nearestFrame, nearestImage);
            }
          }

          currentFrameRef.current = frame;
          requestFramesRef.current(frame, Math.sign(frame - previousFrame));
        }

        const sceneIndex = sceneForProgress(latestProgressRef.current);
        if (sceneIndex !== activeSceneRef.current) {
          activeSceneRef.current = sceneIndex;
          setActiveScene(sceneIndex);
        }

        progressButtonRefs.current.forEach((button, index) => {
          if (!button) return;
          const isCurrent = index === sceneIndex;
          button.classList.toggle("is-current", isCurrent);
          button.setAttribute("aria-current", isCurrent ? "step" : "false");
        });
      });
    },
    [drawFrame],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activeLoads = 0;
    const cache = cacheRef.current;
    const failedFrames = failedFramesRef.current;
    const pending = new Map<number, HTMLImageElement>();
    const urgentLoads = new Set<number>();
    const queue = new Map<
      number,
      { priority: number; fetchPriority: "high" | "low" | "auto" }
    >();
    let urgentFrame: number | null = null;
    let urgentLoadActive = false;

    cache.clear();
    failedFrames.clear();

    const trimCache = (target: number) => {
      const cacheLimit =
        window.innerWidth <= 700 ? MAX_CACHED_MOBILE_FRAMES : MAX_CACHED_DESKTOP_FRAMES;
      while (cache.size > cacheLimit) {
        let furthestFrame = -1;
        let furthestDistance = -1;
        for (const index of cache.keys()) {
          const distance = Math.abs(index - target);
          if (distance > furthestDistance) {
            furthestFrame = index;
            furthestDistance = distance;
          }
        }
        if (furthestFrame === -1) return;
        cache.delete(furthestFrame);
      }
    };

    const startLoad = (
      index: number,
      fetchPriority: "high" | "low" | "auto",
      urgent: boolean,
    ) => {
      if (index < 0 || index >= totalFrames || cache.has(index) || pending.has(index)) {
        if (urgent) {
          urgentLoadActive = false;
          pumpUrgentLoad();
        }
        return;
      }
      const frame = frameManifest.frames[index];
      if (!frame) return;

      const image = new window.Image();
      image.decoding = "async";
      image.fetchPriority = fetchPriority;
      pending.set(index, image);
      if (urgent) urgentLoadActive = true;
      image.onload = () => {
        void image.decode().then(
          () => finishLoad(index, image, true, urgent),
          () => finishLoad(index, image, false, urgent),
        );
      };
      image.onerror = () => finishLoad(index, image, false, urgent);
      image.src = `/${frameManifest.frameDirectory}/${frame.filename}`;
    };

    const finishLoad = (
      index: number,
      image: HTMLImageElement,
      succeeded: boolean,
      urgent: boolean,
    ) => {
      if (pending.get(index) !== image) return;
      pending.delete(index);
      const wasPromoted = urgentLoads.delete(index);
      if (urgent) {
        urgentLoadActive = false;
      } else {
        activeLoads -= 1;
        if (wasPromoted) urgentLoadActive = false;
      }

      if (!cancelled && succeeded) {
        cache.delete(index);
        cache.set(index, image);
        trimCache(currentFrameRef.current);
        if (index === currentFrameRef.current) {
          drawFrame(index, image);
          setIsReady(true);
        }
      } else if (!cancelled && !failedFrames.has(index)) {
        failedFrames.add(index);
        setUnavailableFrameCount(failedFrames.size);
      }

      pumpUrgentLoad();
      pumpQueue();
    };

    const pumpUrgentLoad = () => {
      if (cancelled || urgentLoadActive || urgentFrame === null) return;
      const index = urgentFrame;
      urgentFrame = null;
      if (cache.has(index)) return;
      const existingLoad = pending.get(index);
      if (existingLoad) {
        existingLoad.fetchPriority = "high";
        urgentLoads.add(index);
        urgentLoadActive = true;
        return;
      }
      startLoad(index, "high", true);
    };

    const pumpQueue = () => {
      if (cancelled) return;
      while (activeLoads < LOAD_CONCURRENCY && queue.size > 0) {
        let index = -1;
        let priority = Number.POSITIVE_INFINITY;
        for (const [candidate, job] of queue) {
          if (job.priority < priority) {
            index = candidate;
            priority = job.priority;
          }
        }
        if (index === -1) return;
        const job = queue.get(index);
        queue.delete(index);
        if (!job || index === urgentFrame) continue;
        if (index < 0 || index >= totalFrames || cache.has(index) || pending.has(index)) continue;
        activeLoads += 1;
        startLoad(index, job.fetchPriority, false);
      }
    };

    const requestNeighborhood = (target: number, direction: number) => {
      if (target < 0 || target >= totalFrames || !frameManifest.frames[target]) return;

      urgentFrame = cache.has(target) ? null : target;
      const desired = new Map<
        number,
        { priority: number; fetchPriority: "high" | "low" | "auto" }
      >();
      for (
        let offset = -PRELOAD_RADIUS;
        offset <= PRELOAD_RADIUS;
        offset += 1
      ) {
        const index = target + offset;
        if (
          offset === 0 ||
          index < 0 ||
          index >= totalFrames ||
          cache.has(index) ||
          pending.has(index) ||
          failedFrames.has(index)
        ) {
          continue;
        }

        const isAhead = direction === 0 || Math.sign(offset) === direction;
        const distance = Math.abs(offset);
        desired.set(index, {
          priority: distance + (isAhead ? 0 : PRELOAD_RADIUS),
          fetchPriority: "auto",
        });
      }

      queue.clear();
      for (const [index, job] of desired) queue.set(index, job);
      pumpUrgentLoad();
      pumpQueue();
    };

    requestFramesRef.current = requestNeighborhood;
    requestNeighborhood(currentFrameRef.current, 1);

    return () => {
      cancelled = true;
      queue.clear();
      for (const image of pending.values()) {
        image.onload = null;
        image.onerror = null;
      }
      pending.clear();
      cache.clear();
      requestFramesRef.current = () => {};
    };
  }, [drawFrame, retry]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || !lenis) return;

    const cleanupTasks: Array<() => void> = [];
    const context = gsap.context(() => {
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(rect.width * pixelRatio);
        const height = Math.round(rect.height * pixelRatio);

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          renderedFrameRef.current = -1;
          drawFrame(currentFrameRef.current);
        }
      };

      const observer = new ResizeObserver(resizeCanvas);
      observer.observe(canvas);
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      const trigger = ScrollTrigger.create({
        id: "villa-scroll-sequence",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (reducedMotion ? 1 : 5)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => setSequenceActive(true),
        onEnterBack: () => setSequenceActive(true),
        onLeave: () => setSequenceActive(false),
        onLeaveBack: () => setSequenceActive(false),
        onUpdate: (self) => scheduleScrollRender(self.progress),
        onRefresh: (self) => scheduleScrollRender(self.progress),
      });
      triggerRef.current = trigger;
      ScrollTrigger.refresh();
      scheduleScrollRender(trigger.progress);

      if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
        const moveCard = (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          roomInnerRefs.current.forEach((inner) => {
            if (!inner) return;
            gsap.to(inner, {
              x: x * 9,
              y: y * 7,
              duration: 0.65,
              ease: "power3.out",
              overwrite: true,
            });
          });
        };
        section.addEventListener("pointermove", moveCard, { passive: true });
        cleanupTasks.push(() => section.removeEventListener("pointermove", moveCard));
      }

      cleanupTasks.push(() => {
        observer.disconnect();
        window.removeEventListener("resize", resizeCanvas);
        trigger.kill();
        triggerRef.current = null;
      });
    }, section);

    return () => {
      if (renderRequestRef.current) cancelAnimationFrame(renderRequestRef.current);
      renderRequestRef.current = 0;
      context.revert();
      cleanupTasks.forEach((cleanup) => cleanup());
    };
  }, [drawFrame, lenis, reducedMotion, scheduleScrollRender]);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".villa-cursor");
    const experience = document.querySelector<HTMLElement>(".villa-experience");
    if (
      !cursor ||
      !experience ||
      !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches
    ) return;

    const setX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const setY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
    const moveCursor = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || !experience.contains(event.target)) {
        cursor.classList.remove("is-visible");
        return;
      }
      setX(event.clientX - 10);
      setY(event.clientY - 10);
      cursor.classList.add("is-visible");
    };
    const hideCursor = () => cursor.classList.remove("is-visible");
    window.addEventListener("pointermove", moveCursor, { passive: true });
    experience.addEventListener("pointerleave", hideCursor);
    return () => {
      window.removeEventListener("pointermove", moveCursor);
      experience.removeEventListener("pointerleave", hideCursor);
      gsap.killTweensOf(cursor);
    };
  }, []);

  const scrollToScene = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger || !lenis) return;
    const scene = scenes[index];
    const progress =
      ((scene.startSeconds + scene.endSeconds) / 2) / sourceDurationSeconds;
    const destination = trigger.start + (trigger.end - trigger.start) * progress;
    lenis.scrollTo(destination, {
      duration: reducedMotion ? 0 : 1.2,
      easing: (value) => 1 - Math.pow(1 - value, 4),
    });
  };

  return (
    <div className="villa-experience">
      <section
        ref={sectionRef}
        id="villa-sequence"
        className="villa-sequence"
        style={{
          backgroundImage: `url(/${frameManifest.frameDirectory}/${frameManifest.frames[0].filename})`,
        }}
        aria-label="Scroll-controlled villa walkthrough"
      >
        <canvas
          ref={canvasRef}
          className="villa-canvas"
          aria-label={`Villa image sequence, ${totalFrames} frames`}
          role="img"
        />
        <div className="villa-vignette" aria-hidden="true" />
        <div className="villa-grain" aria-hidden="true" />

        {!isReady && (
          <div className="sequence-loader" role="status" aria-live="polite">
            <span className="sequence-loader-label">Preparing the villa</span>
            <strong>{totalFrames}<small> frames</small></strong>
            <p>{unavailableFrameCount > 0 ? "Some images are unavailable; the tour will continue." : "Loading the opening view…"}</p>
            {unavailableFrameCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsReady(false);
                  setUnavailableFrameCount(0);
                  setRetry((value) => value + 1);
                }}
              >
                Retry opening frames
              </button>
            )}
          </div>
        )}

        {scenes.map((scene, index) => (
          <div
            key={scene.name}
            className={`room-overlay room-overlay-${scene.placement}${activeScene === index ? " is-active" : ""}`}
            aria-hidden={activeScene !== index}
          >
            <div ref={(element) => { roomInnerRefs.current[index] = element; }} className="room-card">
              <span className="room-card-index">
                {String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
              </span>
              <span className="room-card-name">{scene.name}</span>
              <h2>{scene.name}</h2>
              <p>{scene.description}</p>
            </div>
          </div>
        ))}

        {sequenceActive && (
          <nav className="room-progress" aria-label="Villa scene navigation">
            {scenes.map((scene, index) => (
              <button
                key={scene.name}
                ref={(element) => { progressButtonRefs.current[index] = element; }}
                className={`room-progress-item${activeScene === index ? " is-current" : ""}`}
                type="button"
                aria-label={`Scroll to ${scene.name}`}
                aria-current={activeScene === index ? "step" : "false"}
                onClick={() => scrollToScene(index)}
              >
                <span className="room-progress-line" aria-hidden="true" />
                <span>{scene.name}</span>
              </button>
            ))}
          </nav>
        )}

        {unavailableFrameCount > 0 && isReady && (
          <p className="sequence-cache-status" role="status" aria-live="polite">
            {unavailableFrameCount} frame{unavailableFrameCount === 1 ? "" : "s"} unavailable; the sequence remains available.
          </p>
        )}
      </section>
      <div className="villa-cursor" aria-hidden="true" />
    </div>
  );
}
