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
  active: boolean;
}

if (process.browser && !window.katex) {
  window.katex = katex;
}
export default function QuestionMini({ val, qid, active }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (val.kind !== "multipleChoice" || val.kind !== "multipleChoice")
    throw "An object with kind !== 'multipleChoice' was passed to RecentQuestionCard";

  return (
    <div
      className={`shadow-sm bg-white my-4 rounded-lg cursor-pointer hover:shadow-lg ${
        active ? "bg-gray-50" : ""
      }`}
    >
      <Disclosure>
        {() => {
          return (
            <>
              <Disclosure.Button as="div">
                <div className="flex flex-row items-center justify-between p-4">
                  <section
                    dangerouslySetInnerHTML={{
                      __html: val.question,
                    }}
                    className="overflow-hidden mb-2 mr-0 w-11/12"
                  ></section>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${active ? "text-blue-400" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </Disclosure.Button>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
}
