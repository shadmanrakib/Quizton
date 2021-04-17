import Tags from "./Tags";
import React, { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import Editor from "../Editor";
import Choices from "./Choices";
import {
  Question,
  multipleChoice,
  shortAnswer,
  EditRequest,
  MultipleChoiceRequest,
} from "../../types/quesdom";
import { Accordion, AccordionSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";

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

interface Props {
  qid: string;
  question: Question;
}

const CreateMCForm: React.FC<Props> = (props) => {
  const user = useUser();
  let defaultValues;
  if (props.question.kind === "multipleChoice") {
    defaultValues = {
      choices: props.question.answerChoices.map((value) => {
        //React Hook Form needs default values in the form {value: string}[] since html element's name is "value"
        return { value: value };
      }),
      question: props.question.question,
      explanation: props.question.explanation,
      answer: props.question.correctAnswer + "",
      tags: props.question.tags.map((value) => {
        //React Hook Form needs default values in the form {value: string}[] since html element's name is "value"
        return { value: value };
      }),
    };
  }
  if (props.question.kind === "shortAnswer") {
    defaultValues = {
      //Todo
    };
  }
  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    reset,
    trigger,
    setError,
  } = useForm({
    defaultValues: defaultValues,
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  const onSubmit = (data) => {
    if (data.tags === undefined) data.tags = [];
    let postQuestion: MultipleChoiceRequest = {
      kind: "multipleChoice",
      answerChoices: data.choices.map((value) => {
        return value.value;
      }),
      correctAnswer: Number.parseInt(data.answer),
      explanation: data.explanation,
      question: data.question,
      tags: data.tags ? data.tags.map((value) => {
        return value.value;
      }) : [],
    };
    let postThis: EditRequest = { question: postQuestion, qid: props.qid };

    postData("/api/editQuestion", postThis).then((res) => {
      console.log(res);
    });
  };
  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <label className="mt-6 mb-3" htmlFor="question">
        Question
        <span className={`${errors.question ? "text-red-500" : "hidden"}`}>
          {" "}
          This field is required
        </span>
      </label>
      <Controller
        control={control}
        name="question"
        defaultValue={control.getValues("question")}
        rules={{ required: true, minLength: 1 }}
        render={({ onChange, onBlur, value }) => (
          <div className={`bg-white ${errors.question ? "bg-red-50" : ""}`}>
            <Editor
              onChange={onChange}
              theme={"snow"}
              defaultSetValue={value}
            />
          </div>
        )}
      />

      <Choices control={control}></Choices>
      <Accordion className={"mt-3"}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p>Explanation</p>
        </AccordionSummary>

        <Controller
          control={control}
          name="explanation"
          defaultValue={control.getValues("explanation")}
          render={({ onChange, onBlur, value }) => (
            <div
              className={`bg-white ${errors.explanation ? "bg-red-50" : ""}`}
            >
              <Editor
                onChange={onChange}
                theme={"snow"}
                tabIndex={0}
                defaultSetValue={value}
              />
            </div>
          )}
        />
      </Accordion>

      <Tags control={control}></Tags>

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-500 text-white font-bold p-3 hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateMCForm;
