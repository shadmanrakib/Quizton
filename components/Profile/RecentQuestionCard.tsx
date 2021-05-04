import React, { useState } from "react";
import { multipleChoice, QuestionRecentData } from "../../types/quesdom";
import { Disclosure, Transition } from "@headlessui/react";

interface props {
  val: QuestionRecentData;
}
function RecentQuestionCard({ val }: props) {
  const [open, setOpen] = useState<boolean>(false);
  console.log(open);
  if (val.kind !== "multipleChoice" || val.question.kind !== "multipleChoice")
    throw "An object with kind !== 'multipleChoice' was passed to RecentQuestionCard";
  const correctAnswer = val.question.correctAnswer;
  const answerChoices = val.question.answerChoices;
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
                      __html: val.question.question,
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
                  <div
                    className="px-4 pb-2 -mt-2"
                    onClick={() => setOpen(!open)}
                  >
                    {answerChoices.map((html, index) => {
                      return (
                        <div className="" key={index}>
                          <div className="flex flex-row items-center">
                            <input
                              readOnly={true}
                              type="radio"
                              value={index + ""}
                              checked={correctAnswer === index}
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            ></input>
                            <section
                              className={`rounded-md px-1 my-2 overflow-hidden inline-block mx-2 ${
                                correctAnswer === index ? "bg-green-200" : ""
                              }`}
                              dangerouslySetInnerHTML={{ __html: html }}
                            ></section>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Disclosure.Panel>
              )}
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}

export default RecentQuestionCard;
