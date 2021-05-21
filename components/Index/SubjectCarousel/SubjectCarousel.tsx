import React, { useRef, useState } from "react";
import router from "next/router"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

// import Swiper core and required modules
import SwiperCore, { Navigation, Virtual } from "swiper/core";

import styles from "./styles.module.css";

// install Swiper modules
SwiperCore.use([Navigation]);

import subjectsJSON from "./subjects.json";

interface SubjectType {
  name: string;
  link: string;
  textColor: string;
  bgColor: string;
  img: string;
}
const subjects: SubjectType[] = subjectsJSON["subjects"];

export default function SubjectCarousel() {
  return (
    <div className="p-4 mb-4">
      <div className="flex flex-row justify-between">
        <div className="text-3xl">Subjects</div>
        <button onClick={() => router.push('subject')}>View All</button>
      </div>
      <Swiper
        navigation={true}
        grabCursor={true}
        slidesPerView={"auto"}
        spaceBetween={30}
        className="mySwiper mt-4"
        autoHeight={true}
      >
        {subjects.map((subject, index) => {
          return (
            <SwiperSlide key={subject.name} className={styles.sizeAutoIMPORTANT}>
                <SubjectCard {...subject} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

function SubjectCard({ name, link, textColor, bgColor, img }) {
  return (
    <div className={`p-4 h-56 w-96 flex items-center justify-center rounded-2xl`} style={{background: bgColor, color: textColor}}>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
