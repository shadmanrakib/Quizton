import React, { useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { MultipleChoiceRequest } from "../../types/quesdom";
import Question from "./Question";

const defaultMCChoice: MultipleChoiceRequest = {
  answerChoices: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  kind: "multipleChoice",
  question: "",
  tags: [],
};

function CreateQuiz() {
  const { control, register } = useForm({
    defaultValues: { questions: [{ ...defaultMCChoice }] },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "questions", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );
  
  const [focusedQuestion, setFocusedQuestion] = useState(0);

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl mt-4">Create a Quiz</h1>
      <div className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow flex flex-col">
        <label htmlFor="title">Quiz Title</label>
        <input className="border-gray-400 border-b-2 focus:border-blue-400 focus:outline-none p-4 bg-gray-100  text-xl w-auto" name="title" ref={register} type="text"/>
      </div>
      {fields.map((field, index) => {
        return (
          <Controller
            control={control}
            key={field.id}
            defaultValue={defaultMCChoice}
            name={`questions[${index}].value`}
            render={({ onChange, value }) => {
              return (
              <div 
                className={"p-4 md:p-8 my-4 bg-white rounded-2xl shadow hover:shadow-2xl" + (index === focusedQuestion ? " border-l-8 border-blue-400" : "" )}
                onClick={() => setFocusedQuestion(index)}
              >
                <QuizQuestionCard onChange={onChange} value={value} isFocused={index === focusedQuestion} />
              </div>);
            }}
          ></Controller>
        );
      })}
      <div
        className=" mx-auto px-28 py-1.5 rounded-md bg-pink-800 text-white max-w-6xl"
        onClick={() => {
          append({ value: { ...defaultMCChoice } });
          setFocusedQuestion(fields.length)
        }}
      >
        Add Question
      </div>
    </div>
  );
}

export default CreateQuiz;
