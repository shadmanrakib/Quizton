import React, { useState } from "react";
import {
  multipleChoice,
  QuestionRecentData,
  Quiz,
  QuizRecentData,
} from "../../types/quesdom";
import { Disclosure, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

interface props {
  val: Quiz;
  qid: string;
}
export default function UserQuizCard({ val, qid }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  console.log(open);

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
                    router.push("/quiz/" + qid);
                  }}
                >
                  <div
                    className="flex flex-row items-center justify-between"
                    onClick={() => setOpen(!open)}
                  >
                    <p>
                      {`${val.questions.length} Questions`} |{" "}
                      {`${val.author.username}`}
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
                  <p className="font-semibold text-xl">{val.title}</p>
                </section>
              </Disclosure.Button>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}
