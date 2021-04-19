import React from "react";
import { useForm, Controller } from "react-hook-form";
import Questions from "./components/Questions";
import { MultipleChoiceRequest } from "../../types/quesdom";

const defaultMCChoice = {
  answerChoices: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  correctAnswer: 0,
  explanation: "",
  kind: "multipleChoice",
  question: "",
  tags: [],
};

const defaultValues = {
  title: "Untitled Quiz",
  questions: [{ ...defaultMCChoice }],
};

export default function App() {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    errors,
    reset,
    setValue,
  } = useForm(
    {defaultValues: defaultValues});
    
  const onSubmit = (data) => console.log("data", data);

  return (
    <form className="mx-auto max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl mt-4">Create a Quiz</h1>
      <div className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow flex flex-col">
        <label htmlFor="title">Quiz Title</label>
        <input
          className="border-gray-400 border-b-2 focus:border-blue-400 focus:outline-none p-4 bg-gray-100  text-xl w-auto"
          name="title"
          ref={register}
          type="text"
        />
      </div>

      <Questions
        {...{
          control,
          register,
          defaultMCChoice,
          defaultValues,
          getValues,
          setValue,
          errors,
        }}
      />
    
      <div className="flex flex-row">
        <button
          type="button"
          className="bg-red-500 p-3"
          onClick={() => reset(defaultValues)}
        >
          Reset
        </button>

        <input type="submit" className="bg-blue-500 p-3" />
      </div>
    </form>
  );
}
