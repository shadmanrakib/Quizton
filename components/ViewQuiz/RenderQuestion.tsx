import React, { useMemo } from "react";
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
  index: number; //The question number.
}

function RenderQuestion({ question, choices, answer, index }: props) {
  const questionIndex = index;
  const { register, control } = useFormContext();
  const { onChange } = register(`userAnswers.${questionIndex}`);
  console.log("Test");
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
                        }}
                      ></input>
                    )}
                  ></Controller>
                  <label
                    htmlFor={"choice" + index}
                    dangerouslySetInnerHTML={{ __html: choice }}
                    className={
                      "inline-block ml-3 text-lg" +
                      (index == answer ? "" : " text-gray-500")
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

export default React.memo(RenderQuestion);
