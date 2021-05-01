import React, { useState } from "react";
import {
  multipleChoice,
  QuestionRecentData,
  QuizRecentData,
} from "../../types/quesdom";
import { Disclosure, Transition } from "@headlessui/react";
import Quiz from "../ViewQuiz/Quiz";
import { useRouter } from "next/router";

interface props {
  val: QuizRecentData;
}
function RecentQuestionCard({ val }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (val.kind !== "quiz")
    throw "An object with kind !== 'quiz' was passed to RecentQuestionCard";

  //To do: Rneder questions? Or maybe not...?
  return (
    <div className="shadow-sm bg-white my-4 rounded-lg cursor-pointer hover:shadow-lg">
      <Disclosure>
        {() => {
          return (
            <>
              <Disclosure.Button as="div">
                <section
                  className="p-4"
                  onClick={() => {
                    router.push("/quiz/" + val.qid);
                  }}
                >
                  <div
                    className="flex flex-row items-center justify-between"
                    onClick={() => setOpen(!open)}
                  >
                    <p>
                      {`${val.quiz.questions.length} Questions`} |{" "}
                      <span
                        className=" hover:text-yellow-500 font-normal"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push({
                            pathname: "/profile",
                            query: { uid: val.quiz.author.uid },
                          });
                        }}
                      >{`${val.quiz.author.username}`}</span>
                    </p>

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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-xl">{val.quiz.title}</p>
                </section>
              </Disclosure.Button>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}

export default RecentQuestionCard;
