import React from "react";
import { useForm, FormProvider, NestedValue } from "react-hook-form";
import {
  QuizRequest,
  EditQuizRequest,
  multipleChoice,
  Quiz,
} from "../../types/quesdom";
import Questions from "./Questions";
import postData from "../../utility/postData";

//Documentation:
//This form is used for both editing existing quizzes, and creating new quizzes.
//See onSubmit for what the form submits.
//The presence of the optional params "editQuizProps", implies that the quiz is used for editing.

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
    quizQuestions = (props.editQuizProps.defaultQuizValues.questions.map(
      (val) => {
        const copy = { ...val } as any;
        //Need to change from the database schema to the typescript schema
        copy.answerChoices = copy.answerChoices.map((val) => {
          return { value: val };
        });
        copy.tags = copy.tags.map((val) => {
          return { value: val };
        });
        return copy;
      }
    ) as unknown) as NestedValue<QuestionTS[]>;
  }
  console.log(quizQuestions);
  const methods = useForm<QuizTS>({
    defaultValues: { title: quizTitle, questions: quizQuestions },
  });
  const onSubmit = (data: QuizRequest) => {
    if (data.questions) {
      data.questions.forEach((question: Object) => {
        console.log(question);
        postData("/api/createQuestion", question).then((response) => console.log(response)).catch((err) => console.log(err));
      });
    }
    
    //This is not part of each question, so we need to make each question have this
    // in order for "data" to conform to the "QuizRequest" schema
    for (let i = 0; i < data.questions.length; i++) {
      data.questions[i].kind = "multipleChoice";
    }
    //Change each array from {value: something}][] to string[]
    for (let i = 0; i < data.questions.length; i++) {
      data.questions[i].answerChoices = data.questions[i].answerChoices.map(
        (val) => {
          return ((val as unknown) as { value: string }).value;
        }
      );
    }
    for (let i = 0; i < data.questions.length; i++) {
      data.questions[i].tags = data.questions[i].tags.map((val) => {
        return ((val as unknown) as { value: string }).value;
      });
    }

    //Existence of editQuizProps implies this form is being used for editing
    // a prexisitng quiz.
    if (props.editQuizProps) {
      const postThis: EditQuizRequest = {
        qid: props.editQuizProps.qid,
        quiz: data,
      };
      postData("/api/editQuiz", postThis).then((res) => console.log(res)).catch((err) => console.log(err));
      props.editQuizProps.onEditFinished(data);
      console.log("TESTING", data);
      return;
    }
    console.log(data);
    postData("/api/createQuiz", data).then((res) => console.log(res)).catch((err) => console.log(err));
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
              autoComplete="off"
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