"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "https://ik.imagekit.io/3xk2xnjekw/FoS_18_JoaoFilipe_34660.webp",
    alt: "BMW racing on track — precision performance parts",
    objectPosition: "center 80%",
  },
  {
    src: "https://ik.imagekit.io/3xk2xnjekw/DSC_4778.webp",
    alt: "BMW M3 on an open road — premium automotive parts",
    objectPosition: "center 70%",
  },
  {
    src: "https://ik.imagekit.io/3xk2xnjekw/DSC_4800.webp",
    alt: "BMW M4 in a garage — OEM quality components",
    objectPosition: "center 55%",
  },
];

interface HeroSliderProps {
  productCount: number;
}

export default function HeroSlider({ productCount }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative -mt-8 overflow-hidden"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <div className="relative h-48 w-full sm:h-64">

        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17365d]/85 via-[#17365d]/50 to-transparent" />

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <span className="text-xl font-black tracking-tight text-white">
              REVO <span className="text-amber-400">OTOSHOP</span>
            </span>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            {productCount}+ parts available for your vehicle
          </p>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
