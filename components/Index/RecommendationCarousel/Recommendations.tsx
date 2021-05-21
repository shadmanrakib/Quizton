import React, { useEffect, useState } from "react";
import router from "next/router";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";

// import Swiper core and required modules
import SwiperCore, { Navigation } from "swiper/core";

import styles from "./styles.module.css";
import postData from "../../../utility/postData";

// install Swiper modules
SwiperCore.use([Navigation]);

interface Recommendation {
  name: string;
  link: string;
  textColor: string;
  bgColor: string;
  img: string;
}

export default function SubjectCarousel() {
  const [recommendations, setRecommendation] = useState([]);

  useEffect(() => {
    postData("/api/recommend").then((response) => {
      if (response.success) {
        setRecommendation(response.message.results.hits);
      }
      console.log(response);
    });
  }, []);

  return (
    <div className="px-4 py-8 mb-4 bg-blue-500 text-white">
      <div className="flex flex-row justify-between">
        <div className="text-3xl">Recommendations For You</div>
      </div>
      {recommendations.length > 0 ? (
        <Swiper
          navigation={true}
          grabCursor={true}
          slidesPerView={"auto"}
          spaceBetween={30}
          className="mySwiper mt-4 h-56"
          autoHeight={true}
        >
          {recommendations.map((recommendation, index) => {
            return (
              <SwiperSlide className={styles.sizeAutoIMPORTANT}>
                <RecomendationCard {...recommendation} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="mt-4">
          No recommendations at the moment. Do more quizzes.
        </div>
      )}
    </div>
  );
}

function RecomendationCard(props) {
  return (
    <div className={`bg-white text-black p-6 h-56 w-96 flex flex-col rounded-2xl`}>
      <div className="text-xl font-bold flex-initial">{props._source.title}</div>
      <div className="mt-2 flex-auto">
        {props._source.allTags.map((tag, index) => (
          <span className="bg-gray-200 rounded-lg px-2 py-1">{tag}</span>
        ))}
      </div>
      <div className="flex flex-row justify-between items-baseline">
        <div>{props._source.author.username}</div>
        <button className="bg-blue-300 px-4 py-2 rounded-lg">View</button>
      </div>
    </div>
  );
}
