"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const testimonials = [
  {
    name: "Sarah J.",
    quote: "CrowdNest helped me fund my dream project in just 3 days!",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=crowdnest",
  },
  {
    name: "Mike T.",
    quote: "The credit system makes supporting creators so easy.",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=crowdnest",
  },
  {
    name: "Emma L.",
    quote: "A fantastic platform with a great community.",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=crowdnest",
  },
];

export default function TestimonialSlider() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Community Says
        </h2>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          spaceBetween={30}
          slidesPerView={1}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="text-center">
              <img
                src={t.photo}
                alt={t.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <p className="text-lg italic text-gray-600 mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="font-semibold text-blue-600">{t.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
