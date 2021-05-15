import React from "react";

interface props {
  recommended?: boolean;
  image: string;
  title: string;
  left: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >[];
  right: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >[];
}

function SplitPlane({ recommended, image, title, left, right }: props) {
  return (
    <div className="bg-white p-2  border-blue-500 border-l-4 m-4 rounded-md">
      <section className="pb-2 border-gray-200 border-b-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center">
            <img
              src={image}
              width="32px"
              height="32px"
              className="rounded-full"
            ></img>
            <p className="font-semibold text-xl ml-2">{title}</p>
          </div>
        </div>
      </section>
      <section className="flex flex-row mt-3">
        <div className="flex flex-col w-1/2">
          {left.map((value) => {
            return (
              <div className="text-md mb-1 font-sans font-normal hover:underline hover:text-blue-500">
                {value}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-1/2">
          {right.map((value) => {
            return (
              <div className="text-md mb-1 font-sans font-normal hover:underline hover:text-blue-500">
                {value}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SplitPlane;
