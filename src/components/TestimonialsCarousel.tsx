"use client";

import React, { useEffect, useRef, useState } from "react";
import { merri } from "@/app/fonts/merri";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  textColor?: string;
}

const TestimonialsCarousel = ({
  testimonials,
  textColor = "#000",
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll
  useEffect(() => {
    if (testimonials.length > 0 && !isAutoScrollPaused) {
      autoScrollInterval.current = setInterval(() => {
        setIsTransitioning(true);

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length);
          setIsTransitioning(false);
        }, 300);
      }, 3000);

      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current);
        }
      };
    }
  }, [testimonials.length, isAutoScrollPaused]);

  if (testimonials.length === 0) return null;

  return (
    <div className="flex flex-col justify-center items-center gap-2 max-w-2xl mx-auto pt-16 pb-24">
      <div
        className="bg-opacity-60 rounded-lg p-6 text-center cursor-pointer relative"
        onClick={() => setIsAutoScrollPaused((prev) => !prev)}
      >
        <div className="h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
          <div
            className={`transition-all duration-600 ease-in-out ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <p
              className="font-neco italic text-[20px] sm:text-[24px] leading-relaxed line-clamp-7"
              style={{ color: textColor }}
            >
              {testimonials[currentIndex]?.quote}
            </p>

            <div
              className={`${merri.className} mt-4 text-center`}
              style={{ color: textColor }}
            >
              <p className="uppercase font-bold text-[14px] md:text-[16px]">
                {testimonials[currentIndex]?.name},
              </p>

              <p className="font-bold italic text-[13px] md:text-[15px] opacity-90">
                {testimonials[currentIndex]?.designation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;