import { Children, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ProjectCarouselProps {
  children: ReactNode;
}

interface DragState {
  active: boolean;
  moved: boolean;
  pointerId: number;
  startScrollLeft: number;
  startX: number;
}

const initialDragState: DragState = {
  active: false,
  moved: false,
  pointerId: -1,
  startScrollLeft: 0,
  startX: 0,
};

const AUTOPLAY_DELAY_MS = 4800;

export default function ProjectCarousel({ children }: ProjectCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState>({ ...initialDragState });
  const blockClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const items = Children.toArray(children);

  useEffect(() => {
    if (items.length <= 1 || isDragging || isHovering || hasFocusWithin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      const viewport = viewportRef.current;
      if (!viewport || document.visibilityState !== "visible") return;

      const slides = Array.from(
        viewport.querySelectorAll<HTMLElement>(".project-carousel-item"),
      );
      if (slides.length <= 1) return;

      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      const atEnd = maxScrollLeft - viewport.scrollLeft < 8;
      const viewportLeft = viewport.getBoundingClientRect().left;
      const nextSlideLeft = slides
        .map(
          (slide) =>
            slide.getBoundingClientRect().left - viewportLeft + viewport.scrollLeft,
        )
        .find((slideLeft) => slideLeft > viewport.scrollLeft + 8);

      viewport.scrollTo({
        left:
          atEnd || nextSlideLeft === undefined
            ? 0
            : Math.min(nextSlideLeft, maxScrollLeft),
        behavior: "smooth",
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [hasFocusWithin, isDragging, isHovering, items.length]);

  const scrollByPage = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: viewport.clientWidth * 0.9 * direction,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    dragStateRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startScrollLeft: viewport.scrollLeft,
      startX: event.clientX,
    };
    viewport.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;

    const viewport = viewportRef.current;
    const dragState = dragStateRef.current;
    if (!viewport || !dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 5) {
      dragState.moved = true;
      blockClickRef.current = true;
      event.preventDefault();
    }

    viewport.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const finishCurrentDrag = () => {
    dragStateRef.current = { ...initialDragState };
    setIsDragging(false);

    if (blockClickRef.current) {
      window.setTimeout(() => {
        blockClickRef.current = false;
      }, 0);
    }
  };

  const finishPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;

    const viewport = viewportRef.current;
    const dragState = dragStateRef.current;
    if (!viewport || !dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    finishCurrentDrag();
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    dragStateRef.current = {
      active: true,
      moved: false,
      pointerId: -1,
      startScrollLeft: viewport.scrollLeft,
      startX: event.clientX,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const dragState = dragStateRef.current;
    if (!viewport || !dragState.active || dragState.pointerId !== -1) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 5) {
      dragState.moved = true;
      blockClickRef.current = true;
      event.preventDefault();
    }

    viewport.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const finishMouseDrag = () => {
    const dragState = dragStateRef.current;
    if (!dragState.active || dragState.pointerId !== -1) return;
    finishCurrentDrag();
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasFocusWithin(false);
        }
      }}
    >
      <div className="mb-4 hidden items-center justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label="이전 프로젝트 보기"
          onClick={() => scrollByPage(-1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-text-main transition-colors hover:border-line-strong hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FiChevronLeft aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          aria-label="다음 프로젝트 보기"
          onClick={() => scrollByPage(1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-text-main transition-colors hover:border-line-strong hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <FiChevronRight aria-hidden="true" size={20} />
        </button>
      </div>

      <div
        ref={viewportRef}
        role="region"
        aria-label="주요 프로젝트 슬라이드"
        aria-live="off"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={finishMouseDrag}
        onMouseLeave={finishMouseDrag}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (!blockClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        className={`project-carousel flex gap-5 overflow-x-auto pb-3 select-none ${
          isDragging
            ? "cursor-grabbing snap-none"
            : "cursor-grab snap-x snap-mandatory"
        }`}
      >
        {items.map((child, index) => (
          <div key={index} className="project-carousel-item min-w-0 snap-start">{child}</div>
        ))}
      </div>

      <p className="mt-2 text-center text-xs tracking-wide text-text-subtle sm:hidden">
        옆으로 밀어 프로젝트를 둘러보세요
      </p>
    </div>
  );
}
