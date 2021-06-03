import React, { useMemo, useState } from "react";
import striptags from "striptags";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Controller, useForm, useFormContext } from "react-hook-form";
import * as quesdom from "../../types/quesdom";
if (process.browser && !window.katex) {
  window.katex = katex;
}

interface props {
  question: string;
  choices: string[];
  answer: number; //Non-negative integer. Represents the correct choice
  questionIndex: number; //The question number.
  check: boolean; //Show correct answer or not
}

function RenderQuestion({
  question,
  choices,
  answer,
  questionIndex,
  check,
}: props) {
  const { register, control, getValues } = useFormContext();
  const { onChange } = register(`userAnswers.${questionIndex}`);
  const [userAnswer, setUserAnswer] = useState<null | string>(null);
  console.log(check);
  console.log(answer);
  return (
    <div>
      {/* Ask how to check if question is completed. */}
      {striptags(question) != "" ? (
        <>
          <div className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow flex flex-col">
            <div
              className="my-6 font-serif md:text-lg"
              dangerouslySetInnerHTML={{ __html: question }}
            ></div>
            <div>
              {choices.map((choice, index) => (
                <div key={index}>
                  <Controller
                    control={control}
                    defaultValue={null}
                    key={index}
                    name={`userAnswers.${questionIndex}`}
                    render={({ field: { onChange } }) => (
                      <input
                        type="radio"
                        id={"choice" + index}
                        name={`Question#${questionIndex}`}
                        value={index}
                        onChange={(e) => {
                          onChange(e.target.value);
                          setUserAnswer(e.target.value);
                        }}
                      ></input>
                    )}
                  ></Controller>

                  <label
                    htmlFor={"choice" + index}
                    dangerouslySetInnerHTML={{ __html: choice }}
                    className={
                      "inline-block ml-3 text-lg " +
                      (answer.toString() === index.toString() && check
                        ? "bg-green-300 rounded-md"
                        : "") +
                      (userAnswer === index.toString() && check
                        ? "bg-red-300 rounded-md"
                        : "")
                    }
                  ></label>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="my-6 font-serif md:text-lg">Incomplete!</div>
      )}
    </div>
  );
}

export default RenderQuestion;
