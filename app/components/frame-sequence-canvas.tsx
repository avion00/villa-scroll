"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./smooth-scroll-provider";

gsap.registerPlugin(ScrollTrigger);

type Room = {
  name: string;
  title: string;
  description: string;
  start: number;
  end: number;
  placement: "left" | "right";
};

const rooms: Room[] = [
  { name: "Entrance", title: "A quieter arrival.", description: "A first look at the architecture, setting the tone for the home.", start: 0, end: 0.16, placement: "left" },
  { name: "Living Room", title: "Space to settle in.", description: "Open living spaces bring light, texture and everyday life together.", start: 0.16, end: 0.33, placement: "right" },
  { name: "Kitchen", title: "Made for the daily ritual.", description: "Considered lines and natural materials shape the heart of the home.", start: 0.33, end: 0.5, placement: "left" },
  { name: "Bedroom", title: "Room to find your rhythm.", description: "A softer retreat, composed around calm and quiet.", start: 0.5, end: 0.67, placement: "right" },
  { name: "Bathroom", title: "A moment to pause.", description: "A measured palette and gentle light bring a sense of ease.", start: 0.67, end: 0.84, placement: "left" },
  { name: "Garden", title: "The day opens outward.", description: "A final glimpse of the home meeting its landscape.", start: 0.84, end: 1, placement: "right" },
];

const INITIAL_CONCURRENCY = 12;
const BACKGROUND_CONCURRENCY = 4;

function framePath(index: number) {
  return `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;
}

function frameForProgress(progress: number, totalFrames: number) {
  return Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)));
}

export default function FrameSequenceCanvas({
  frameCount = 720,
  initialFrameCount = 150,
}: {
  frameCount?: number;
  initialFrameCount?: number;
}) {
  const totalFrames = Math.max(1, Math.floor(frameCount));
  const initialFrames = Math.min(totalFrames, Math.max(1, Math.floor(initialFrameCount)));
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const roomInnerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const roomTimelineRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const progressButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const framesRef = useRef<Array<HTMLImageElement | null>>([]);
  const pendingFramesRef = useRef(new Map<number, Promise<void>>());
  const requestFrameRef = useRef<(index: number) => void>(() => {});
  const currentFrameRef = useRef(0);
  const activeRoomRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const backgroundProgressRef = useRef(0);
  const latestProgressRef = useRef(0);
  const renderRequestRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [loadedInitial, setLoadedInitial] = useState(0);
  const [settledInitial, setSettledInitial] = useState(0);
  const [initialFailures, setInitialFailures] = useState<number[]>([]);
  const [backgroundProgress, setBackgroundProgress] = useState(0);
  const [backgroundFailures, setBackgroundFailures] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);
  const [sequenceActive, setSequenceActive] = useState(false);

  const drawFrame = useCallback((index: number) => {
    if (renderedFrameRef.current === index) return;
    const canvas = canvasRef.current;
    const image = framesRef.current[index];
    if (!canvas || !image || image.naturalWidth === 0) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;

    context.clearRect(0, 0, width, height);
    context.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
    renderedFrameRef.current = index;
    canvas.dataset.frameIndex = String(index);
  }, []);

  const scheduleScrollRender = useCallback((progress: number) => {
    latestProgressRef.current = progress;
    if (renderRequestRef.current) return;

    renderRequestRef.current = requestAnimationFrame(() => {
      renderRequestRef.current = 0;
      const frame = frameForProgress(latestProgressRef.current, totalFrames);
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame;
        drawFrame(frame);
      } else if (renderedFrameRef.current === -1) {
        drawFrame(frame);
      }
      if (!framesRef.current[frame]) requestFrameRef.current(frame);

      const roomIndex = rooms.findIndex(
        (room, index) =>
          latestProgressRef.current >= room.start &&
          (latestProgressRef.current < room.end || index === rooms.length - 1),
      );
      const safeRoomIndex = roomIndex === -1 ? rooms.length - 1 : roomIndex;
      if (safeRoomIndex !== activeRoomRef.current) {
        activeRoomRef.current = safeRoomIndex;
        setActiveRoom(safeRoomIndex);
      }

      roomTimelineRefs.current.forEach((timeline, index) => {
        if (!timeline) return;
        const room = rooms[index];
        const localProgress = Math.max(
          0,
          Math.min(1, (latestProgressRef.current - room.start) / (room.end - room.start)),
        );
        timeline.progress(localProgress, false);
      });

      progressButtonRefs.current.forEach((button, index) => {
        if (!button) return;
        const isCurrent = index === safeRoomIndex;
        button.classList.toggle("is-current", isCurrent);
        button.setAttribute("aria-current", isCurrent ? "step" : "false");
      });
    });
  }, [drawFrame, totalFrames]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || !lenis) return;

    const cleanupTasks: Array<() => void> = [];
    const context = gsap.context(() => {
      roomTimelineRefs.current = rooms.map((_, index) => {
        const card = roomCardRefs.current[index];
        if (!card) return null;
        return gsap.timeline({ paused: true })
          .fromTo(
            card,
            { autoAlpha: 0, y: 22, filter: "blur(9px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.22, ease: "power3.out" },
          )
          .to({}, { duration: 0.52 })
          .to(card, { autoAlpha: 0, y: -14, filter: "blur(7px)", duration: 0.26, ease: "power2.in" });
      });

      const observer = new ResizeObserver(() => {
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
      });
      observer.observe(canvas);

      const trigger = ScrollTrigger.create({
        id: "villa-scroll-sequence",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          setSequenceActive(true);
        },
        onEnterBack: () => {
          setSequenceActive(true);
        },
        onLeave: () => {
          setSequenceActive(false);
        },
        onLeaveBack: () => {
          setSequenceActive(false);
        },
        onUpdate: (self) => scheduleScrollRender(self.progress),
        onRefresh: (self) => scheduleScrollRender(self.progress),
      });
      triggerRef.current = trigger;
      ScrollTrigger.refresh();
      scheduleScrollRender(trigger.progress);

      const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
      if (media.matches) {
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
  }, [drawFrame, lenis, scheduleScrollRender]);

  useEffect(() => {
    let cancelled = false;
    let nextIndex = 0;
    const pendingFrames = pendingFramesRef.current;
    framesRef.current.length = totalFrames;
    backgroundProgressRef.current = 0;

    const loadFrame = (index: number, priority: "high" | "low") => {
      if (framesRef.current[index]) return Promise.resolve();
      const pending = pendingFrames.get(index);
      if (pending) return pending;

      const request = new Promise<void>((resolve, reject) => {
        const image = new window.Image();
        image.decoding = "async";
        image.fetchPriority = priority;
        image.onload = () => {
          if (cancelled) {
            resolve();
            return;
          }
          framesRef.current[index] = image;
          if (currentFrameRef.current === index) {
            renderedFrameRef.current = -1;
            drawFrame(index);
          }
          resolve();
        };
        image.onerror = () => reject(new Error(`Could not load ${framePath(index)}`));
        image.src = framePath(index);
      }).finally(() => {
        if (pendingFrames.get(index) === request) {
          pendingFrames.delete(index);
        }
      });
      pendingFrames.set(index, request);
      return request;
    };

    let demandLoading = false;
    let queuedDemand: number | null = null;
    const processDemandQueue = async () => {
      if (demandLoading) return;
      demandLoading = true;
      while (!cancelled && queuedDemand !== null) {
        const index = queuedDemand;
        queuedDemand = null;
        if (framesRef.current[index]) continue;
        try {
          await loadFrame(index, "high");
        } catch {
          if (!cancelled) {
            setBackgroundFailures((failures) =>
              failures.includes(index) ? failures : [...failures, index].sort((a, b) => a - b),
            );
          }
        }
      }
      demandLoading = false;
    };
    const requestFrame = (index: number) => {
      queuedDemand = index;
      void processDemandQueue();
    };
    requestFrameRef.current = requestFrame;

    const loadRange = async (
      start: number,
      end: number,
      concurrency: number,
      priority: "high" | "low",
      onSettled: (succeeded: boolean) => void,
    ) => {
      nextIndex = start;
      const failures: number[] = [];

      const worker = async () => {
        while (!cancelled) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= end) return;
          let succeeded = false;
          try {
            await loadFrame(index, priority);
            succeeded = true;
          } catch {
            failures.push(index);
          } finally {
            if (!cancelled) onSettled(succeeded);
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(concurrency, end - start) }, () => worker()),
      );
      return failures;
    };

    const loadSequence = async () => {
      const failures = await loadRange(
        0,
        initialFrames,
        INITIAL_CONCURRENCY,
        "high",
        (succeeded) => {
          setSettledInitial((count) => count + 1);
          if (succeeded) setLoadedInitial((count) => count + 1);
        },
      );
      if (cancelled) return;
      if (failures.length) {
        setInitialFailures(failures.sort((a, b) => a - b));
        return;
      }

      setIsReady(true);
      if (initialFrames >= totalFrames) return;
      const backgroundErrors = await loadRange(
        initialFrames,
        totalFrames,
        BACKGROUND_CONCURRENCY,
        "low",
        () => {
          backgroundProgressRef.current += 1;
          if (
            backgroundProgressRef.current % BACKGROUND_CONCURRENCY === 0 ||
            backgroundProgressRef.current === totalFrames - initialFrames
          ) {
            setBackgroundProgress(backgroundProgressRef.current);
          }
        },
      );
      if (!cancelled) setBackgroundFailures(backgroundErrors.sort((a, b) => a - b));
    };

    void loadSequence();
    return () => {
      cancelled = true;
      queuedDemand = null;
      pendingFrames.clear();
      if (requestFrameRef.current === requestFrame) {
        requestFrameRef.current = () => {};
      }
    };
  }, [drawFrame, initialFrames, retry, totalFrames]);

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

  const scrollToRoom = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger || !lenis) return;
    const room = rooms[index];
    const progress = room.start + (room.end - room.start) * 0.42;
    const destination = trigger.start + (trigger.end - trigger.start) * progress;
    lenis.scrollTo(destination, {
      duration: 1.2,
      easing: (value) => 1 - Math.pow(1 - value, 4),
    });
  };

  const loadingPercent = Math.floor((settledInitial / initialFrames) * 100);
  const backgroundCount = totalFrames - initialFrames;
  const backgroundPercent = backgroundCount
    ? Math.floor((backgroundProgress / backgroundCount) * 100)
    : 100;

  return (
    <div className="villa-experience">
      <section
        ref={sectionRef}
        id="villa-sequence"
        className="villa-sequence"
        aria-label="Scroll-controlled villa walkthrough"
      >
        <canvas ref={canvasRef} className="villa-canvas" aria-label="Villa image sequence controlled by scrolling" role="img" />
        <div className="villa-vignette" aria-hidden="true" />
        <div className="villa-grain" aria-hidden="true" />
        {!isReady && (
          <div className="sequence-loader" role="status" aria-live="polite">
            {initialFailures.length ? (
              <>
                <p>Some frames could not be loaded.</p>
                <button
                  type="button"
                  onClick={() => {
                    framesRef.current = Array.from({ length: totalFrames }, () => null);
                    currentFrameRef.current = 0;
                    renderedFrameRef.current = -1;
                    setLoadedInitial(0);
                    setSettledInitial(0);
                    setInitialFailures([]);
                    setBackgroundProgress(0);
                    setBackgroundFailures([]);
                    setIsReady(false);
                    setRetry((value) => value + 1);
                  }}
                >
                  Retry sequence
                </button>
              </>
            ) : (
              <>
                <span className="sequence-loader-label">Preparing the villa</span>
                <strong>{String(loadingPercent).padStart(2, "0")}<small>%</small></strong>
                <span className="sequence-loader-track"><i style={{ width: `${loadingPercent}%` }} /></span>
                <span className="sr-only">{loadedInitial} of {initialFrames} frames loaded; {settledInitial} checked.</span>
              </>
            )}
          </div>
        )}

        {rooms.map((room, index) => (
          <div
            key={room.name}
            ref={(element) => { roomCardRefs.current[index] = element; }}
            className={`room-overlay room-overlay-${room.placement}`}
            aria-hidden={activeRoom !== index}
          >
            <div ref={(element) => { roomInnerRefs.current[index] = element; }} className="room-card">
              <span className="room-card-index">0{index + 1} / 06</span>
              <span className="room-card-name">{room.name}</span>
              <h2>{room.title}</h2>
              <p>{room.description}</p>
            </div>
          </div>
        ))}

        {sequenceActive && (
          <nav className="room-progress" aria-label="Villa room navigation">
            {rooms.map((room, index) => (
              <button
                key={room.name}
                ref={(element) => { progressButtonRefs.current[index] = element; }}
                className={`room-progress-item${activeRoom === index ? " is-current" : ""}`}
                type="button"
                aria-label={`Scroll to ${room.name}`}
                aria-current={activeRoom === index ? "step" : "false"}
                onClick={() => scrollToRoom(index)}
              >
                <span className="room-progress-line" aria-hidden="true" />
                <span>{room.name}</span>
              </button>
            ))}
          </nav>
        )}

        {isReady && backgroundCount > 0 && backgroundProgress < backgroundCount && (
          <p className="sequence-cache-status" role="status" aria-live="polite">
            Caching remaining frames · {backgroundPercent}%
          </p>
        )}
        {backgroundFailures.length > 0 && (
          <p className="sequence-cache-status" role="status">
            {backgroundFailures.length} background frames unavailable
          </p>
        )}
        </section>
        <div className="villa-cursor" aria-hidden="true" />
    </div>
  );
}
