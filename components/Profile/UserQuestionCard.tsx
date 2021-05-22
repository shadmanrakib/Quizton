import React, { useState } from "react";
import {
  multipleChoice,
  Question,
  QuestionRecentData,
} from "../../types/quesdom";
import { Disclosure, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import katex from "katex";
import "katex/dist/katex.min.css";
interface props {
  val: Question;
  qid: string;
}

if (process.browser && !window.katex) {
  window.katex = katex;
}
export default function UserQuestionCard({ val, qid }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (val.kind !== "multipleChoice" || val.kind !== "multipleChoice")
    throw "An object with kind !== 'multipleChoice' was passed to RecentQuestionCard";

  return (
    <div className="shadow-sm bg-white my-4 rounded-lg cursor-pointer hover:shadow-lg">
      <Disclosure>
        {() => {
          return (
            <>
              <Disclosure.Button as="div">
                <div
                  className="flex flex-row items-center justify-between p-4"
                  onClick={() => setOpen(!open)}
                >
                  <section
                    dangerouslySetInnerHTML={{
                      __html: val.question,
                    }}
                    className="overflow-hidden mb-2 mr-0 w-11/12"
                  ></section>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Disclosure.Button>

              {open && (
                <Disclosure.Panel static>
                  <section>
                    <div
                      className="px-4 pb-4 -mt-3"
                      onClick={() => setOpen(!open)}
                    >
                      {val.answerChoices.map((html, index) => {
                        return (
                          <div className="">
                            <div className="flex flex-row items-center">
                              <input
                                readOnly={true}
                                type="radio"
                                value={index + ""}
                                key={index}
                                checked={val.correctAnswer === index}
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              ></input>
                              <section
                                className={`rounded-md px-1 my-2 overflow-hidden inline-block mx-2 ${
                                  val.correctAnswer === index
                                    ? "bg-green-200"
                                    : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: html }}
                              ></section>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        className="bg-blue-500 text-sm font-semibold py-1 px-4 mt-2  rounded-xl  text-white ring-0 focus:ring-0 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/question/" + qid);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </section>
                </Disclosure.Panel>
              )}
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}
