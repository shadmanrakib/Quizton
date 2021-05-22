import { useRouter } from "next/router";
import React from "react";
import * as quesdom from "../../types/quesdom";

interface props {
  recommended?: boolean;
  image: string;
  title: string;
  left: string[];
  right: string[];
  subject: string;
}

function SplitPlane({
  recommended,
  image,
  title,
  left,
  right,
  subject,
}: props) {
  const router = useRouter();
  return (
    <div className="bg-white p-2  border-blue-500 border-l-4 m-4 rounded-md">
      <section className="pb-2 border-gray-200 border-b-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center">
            <img
              src={image}
              width="25px"
              height="25px"
              className="rounded-full"
            ></img>
            <p
              onClick={() => {
                router.push(`/subject/${subject}/${title}`);
              }}
              className="font-semibold text-xl ml-2 hover:underline hover:text-blue-500 cursor-pointer"
            >
              {title}
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-row mt-3">
        <div className="flex flex-col w-1/2">
          {left.map((value) => {
            return (
              <p
                onClick={() => {
                  router.push(`/subject/${subject}/${title}/${value}`);
                }}
                key={value}
                className="text-md mb-1 font-sans font-normal hover:underline hover:text-blue-500 cursor-pointer"
              >
                {value}
              </p>
            );
          })}
        </div>
        <div className="flex flex-col w-1/2">
          {right.map((value) => {
            return (
              <p
                onClick={() => {
                  router.push(`/subject/${subject}/${title}/${value}`);
                }}
                key={value}
                className="text-md mb-1 font-sans font-normal hover:underline hover:text-blue-500 cursor-pointer"
              >
                {value}
              </p>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SplitPlane;
