import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export interface Banner {
  id: number;
  title: string;
  imageDesktopUrl: string;
  imageMobileUrl?: string | null;
  targetUrl: string;
}

interface HomeCarouselProps {
  banners: Banner[];
}

const CarouselWrapper = styled.div`
  width: 100%;
  height: 450px; /* Altura exata desse padrão de e-commerce! */
  position: relative;
  background-color: #000000;
  overflow: hidden;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide a {
    display: block;
    width: 100%;
    height: 100%;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Estica de ponta a ponta sem sobrar borda preta */
    object-position: center; /* Mantém o foco no meio da sua arte */
  }

  @media (max-width: 768px) {
    height: 280px;
  }
`;

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <CarouselWrapper>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a 
              href={banner.targetUrl} 
              title={banner.title}
            >
              <img
                src={banner.imageDesktopUrl}
                alt={banner.title}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselWrapper>
  );
};