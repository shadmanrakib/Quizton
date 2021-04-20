import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Questions from "./Questions";

const defaultMCChoice = {
  answerChoices: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  correctAnswer: "0",
  explanation: "",
  kind: "multipleChoice",
  question: "",
  tags: [],
};

interface TagTS {
  value: string;
}

interface ChoiceTS {
  value: string;
}

interface QuestionTS {
  tags: TagTS[];
  kind: string;
  answerChoices: ChoiceTS[];
  correctAnswer: string;
  explanation: string;
  question: string;
}

interface QuizTS {
  title: string;
  questions: QuestionTS[];
}

export default function Form() {
  const methods = useForm<QuizTS>({
    defaultValues: { title: "", questions: [{ ...defaultMCChoice }] },
  });
  const onSubmit = (data) => console.log(data);

  return (
    <div className="flex flex-col max-w-3xl p-4 mx-auto">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl mt-4">Create a Quiz</h1>
          <div className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow flex flex-col">
            <label htmlFor="title">Quiz Title</label>
            <input
              className="border-gray-400 border-b-2 focus:border-blue-400 focus:outline-none p-4 bg-gray-100  text-xl w-auto"
              type="text"
              {...methods.register("title")}
            />
          </div>
          <Questions {...{ defaultMCChoice }} />
          <button className="w-auto bg-blue-500 text-white p-3">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}
