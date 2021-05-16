
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css"

// import Swiper core and required modules
import SwiperCore, {
  Navigation
} from 'swiper/core';

import styles from "./styles.module.css";

// install Swiper modules
SwiperCore.use([Navigation]);

import subjectsJSON from "./subjects.json";

interface SubjectType {
  name: string,
  link: string,
  textColor: string,
  bgColor: string,
  img: string
}
const subjects: SubjectType[] = subjectsJSON["subjects"];

export default function SubjectCarousel() {
  return (
    <div>
    <Swiper navigation={true} grabCursor={true} slidesPerView={"auto"} spaceBetween={30} className="mySwiper h-72" >
        {subjects.map((sub, index) => {
          return <SwiperSlide className={styles.wAutoIMPORTANT}>
            <div className={`p-4 w-96`}>
              <div>{sub.name}</div>
            </div>
          </SwiperSlide>
        })}
    </Swiper>
    </div>
  )
}