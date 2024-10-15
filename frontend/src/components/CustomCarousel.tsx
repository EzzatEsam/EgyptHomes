"use client";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface CarouselProps {
  images: string[];
  className?: string;
}

const CustomCarousel: React.FC<CarouselProps> = ({ images, className }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const GotoSlide = (dir: 1 | -1) => {
    const width = parentRef.current?.clientWidth || 0;
    const currentScrollLeft = parentRef.current?.scrollLeft || 0;

    // When moving forward (dir = 1), add the width to the current scroll position.
    // When moving backward (dir = -1), subtract the width.
    parentRef.current?.scrollTo({
      left: currentScrollLeft + width * dir,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn("carousel w-full relative cursor-auto", className)}
      onClick={(e) => e.stopPropagation()}
      ref={parentRef}
    >
      {images.map((image, index) => (
        <div key={index} className="carousel-item relative w-full">
          <img
            src={image}
            className="w-full object-cover h-full"
            alt={`Slide ${index + 1}`}
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              className="btn btn-circle"
              onClick={() => GotoSlide(-1)}
              disabled={index == 0}
            >
              ❮
            </button>

            <button
              className="btn btn-circle"
              onClick={() => GotoSlide(+1)}
              disabled={index == images.length - 1}
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomCarousel;
