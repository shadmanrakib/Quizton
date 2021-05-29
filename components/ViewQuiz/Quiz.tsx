import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as quesdom from "../../types/quesdom";
import postData from "../../utility/postData";
import RenderQuestion from "./RenderQuestion";
import stripTags from "striptags";

import { Question as QuestionSchema } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import Head from "next/head";

interface props {
  quiz: quesdom.Quiz;
  qid: string;
}

interface Inputs {
  userAnswers: string[];
}

function Quiz({ quiz, qid }: props) {
  const methods = useForm<Inputs>({
    //User responses. Example: [1, 2, 0, null, 1, 2]. Null is for no response
    defaultValues: {
      userAnswers: quiz.questions.map(() => null),
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/addRecent", { qid: qid, kind: "quiz" });
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col max-w-3xl p-4 mx-auto">
            {quiz.questions.map((question, index) => {
              if (question.kind === "multipleChoice") {
                return (
                  <RenderQuestion
                    answer={question.correctAnswer}
                    choices={question.answerChoices}
                    question={question.question}
                    index={index}
                    key={index}
                  ></RenderQuestion>
                );
              }
            })}
            <button
              className="w-auto bg-blue-500 text-white p-3 rounded-lg focus:outline-none"
              type="submit"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default Quiz;
