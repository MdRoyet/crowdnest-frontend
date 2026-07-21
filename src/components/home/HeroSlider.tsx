"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  const slides = [
    {
      title: "Innovate the Future",
      desc: "Support tech campaigns that change the world.",
      bg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "Empower Creators",
      desc: "Help artists bring their visions to life.",
      bg: "https://images.unsplash.com/photo-1452830978618-d6feae7d0ffa?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "Build Communities",
      desc: "Fund causes that make a difference.",
      bg: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return (
    <div className="h-[500px] w-full relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
                  {slide.desc}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
