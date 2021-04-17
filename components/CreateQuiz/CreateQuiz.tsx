import React, { useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { MultipleChoiceRequest } from "../../types/quesdom";

const defaultMCChoice: MultipleChoiceRequest = {
  answerChoices: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  kind: "multipleChoice",
  question: "",
  tags: [],
};

function CreateQuiz() {
  const { control } = useForm({
    defaultValues: { questions: [{ ...defaultMCChoice }] },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "questions", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );
  return (
    <div className="flex flex-col">
      <p>Create a Quiz</p>
      {fields.map((field, index) => {
        return (
          <Controller
            control={control}
            key={field.id}
            defaultValue={null}
            name={`questions[${index}].value`}
            render={({ onChange, value }) => {
              return <QuizQuestionCard onEdit={onChange} value={value} />;
            }}
          ></Controller>
        );
      })}
      <div
        className=" mx-auto px-28 py-1.5 rounded-md bg-pink-800 text-white max-w-6xl"
        onClick={() => {
          append({ value: { ...defaultMCChoice } });
        }}
      >
        Add Question
      </div>
    </div>
  );
}

export default CreateQuiz;
