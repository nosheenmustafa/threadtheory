"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

interface Banner {
  image: string;
  title: string;
  link: string;
}

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  if (!banners || banners.length === 0) return null;
  return (
    <div className="w-full my-8 rounded-lg overflow-hidden shadow-lg">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        spaceBetween={0}
        slidesPerView={1}
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block relative w-full h-80">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-80 object-cover bg-white"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-xl font-bold drop-shadow-lg">{banner.title}</h3>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 