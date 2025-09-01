import { HStack, StackProps } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

interface Props extends StackProps {
  fRef?: any;
  children?: any;
}

const HScroll = ({ fRef, children, ...props }: Props) => {
  const hStackRef = fRef ?? useRef<HTMLDivElement>(null);
  const scrollVelocity = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = hStackRef.current;
    if (!el) return;

    const handleScroll = (event: WheelEvent) => {
      const canScroll = el.scrollWidth > el.clientWidth;
      if (!canScroll) return;

      event.preventDefault(); // stop vertical scroll

      scrollVelocity.current += event.deltaY * 0.2;

      if (!rafId.current) {
        const smoothScroll = () => {
          if (!el) return;
          el.scrollLeft += scrollVelocity.current;
          scrollVelocity.current *= 0.85;

          if (Math.abs(scrollVelocity.current) > 0.5) {
            rafId.current = requestAnimationFrame(smoothScroll);
          } else {
            rafId.current = null;
          }
        };
        rafId.current = requestAnimationFrame(smoothScroll);
      }
    };

    el.addEventListener("wheel", handleScroll, { passive: false });
    return () => el.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <HStack
      ref={hStackRef}
      overflowX="auto"
      overflowY="hidden"
      w="full"
      className={`scrollX ${props.className ?? ""}`}
      {...props}
    >
      {children}
    </HStack>
  );
};

export default HScroll;
