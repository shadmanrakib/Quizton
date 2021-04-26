import React from "react";
import { useForm, FormProvider, NestedValue } from "react-hook-form";
import {
  QuizRequest,
  EditQuizRequest,
  multipleChoice,
  Quiz,
} from "../../types/quesdom";
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
  tags: NestedValue<TagTS[]>;
  kind: string;
  answerChoices: NestedValue<ChoiceTS[]>;
  correctAnswer: string;
  explanation: string;
  question: string;
}

type QuizTS = {
  title: string;
  questions: NestedValue<QuestionTS[]>;
};

type EditQuizProps = {
  defaultQuizValues: {
    title: string;
    questions: multipleChoice[];
  };
  qid: string;
  onEditFinished: (newQuiz: QuizRequest) => void;
};

interface props {
  editQuizProps?: EditQuizProps;
}

export default function Form(props: props) {
  let quizTitle = "";
  let quizQuestions = [{ ...defaultMCChoice }];
  if (props.editQuizProps) {
    quizTitle = props.editQuizProps.defaultQuizValues.title;
    quizQuestions = (props.editQuizProps.defaultQuizValues
      .questions as unknown) as NestedValue<QuestionTS[]>;
  }

  const methods = useForm<QuizTS>({
    defaultValues: { title: quizTitle, questions: quizQuestions },
  });
  const onSubmit = (data: QuizRequest) => {
    //This is not part of each question, so we need to make each question have this
    // in order for "data" to conform to the "QuizRequest" schema
    for (let i = 0; i < data.questions.length; i++) {
      data.questions[i].kind = "multipleChoice";
    }
    //Existence of editQuizProps implies this form is being used for editing
    // a prexisitng quiz.
    if (props.editQuizProps) {
      const postThis: EditQuizRequest = {
        qid: props.editQuizProps.qid,
        quiz: data,
      };
      postData("/api/editQuiz", postThis).then((res) => console.log(res));
      props.editQuizProps.onEditFinished(data);
      console.log("TESTING", data);
      return;
    }
    postData("/api/createQuiz", data).then((res) => console.log(res));
  };

  return (
    <div className="flex flex-col max-w-3xl p-4 mx-auto">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl mt-4">
            {props.editQuizProps ? "Edit Your Quiz" : "Create a Quiz"}
          </h1>
          <div className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow flex flex-col">
            <label htmlFor="title">Quiz Title</label>
            <input
              className="border-gray-400 border-b-2 focus:border-blue-400 focus:outline-none p-4 bg-gray-100  text-xl w-auto"
              type="text"
              {...methods.register("title")}
            />
          </div>
          <Questions {...{ defaultMCChoice }} />
          <button
            className="w-auto bg-blue-500 text-white p-3"
            type="submit"
            onClick={() => {
              console.log(methods.formState.errors);
            }}
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
