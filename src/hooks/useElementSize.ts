import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface ElementSize {
  width: number;
  height: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  offsetTop: number;
  offsetLeft: number;
  isVisible: boolean;
}

interface UseElementSizeResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  size: ElementSize;
  refresh: () => void;
}

export const useElementSize = <
  T extends HTMLElement
>(): UseElementSizeResult<T> => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
    clientWidth: 0,
    clientHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    offsetTop: 0,
    offsetLeft: 0,
    isVisible: false,
  });

  const updateSize = useCallback(() => {
    if (!ref.current) return;

    const {
      offsetWidth,
      offsetHeight,
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
      offsetTop,
      offsetLeft,
    } = ref.current;

    const isVisible = !!(
      offsetWidth ||
      offsetHeight ||
      clientWidth ||
      clientHeight
    );

    setSize((prev) => {
      // Hanya update jika ada perubahan
      if (
        prev.width === offsetWidth &&
        prev.height === offsetHeight &&
        prev.clientWidth === clientWidth &&
        prev.clientHeight === clientHeight &&
        prev.scrollWidth === scrollWidth &&
        prev.scrollHeight === scrollHeight &&
        prev.offsetTop === offsetTop &&
        prev.offsetLeft === offsetLeft &&
        prev.isVisible === isVisible
      ) {
        return prev;
      }
      return {
        width: offsetWidth,
        height: offsetHeight,
        clientWidth,
        clientHeight,
        scrollWidth,
        scrollHeight,
        offsetTop,
        offsetLeft,
        isVisible,
      };
    });
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(updateSize);
    observer.observe(ref.current);

    // Initial measurement
    updateSize();

    return () => observer.disconnect();
  }, [updateSize]);

  return { ref, size, refresh: updateSize };
};
