import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Editor from "../Editor";
import { Accordion, AccordionSummary } from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";
import { TrashIcon } from "@heroicons/react/outline";
import Tags from "./Tags";
import Choices from "./Choices";
import router from "next/router";

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

export default function Form() {
  const methods = useForm<QuizTS>({
    defaultValues: { title: "", questions: [defaultMCChoice] },
  });
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/createQuestion", data).then((response) => {
      console.log(response);
      router.push("/");
    });
  };

  return (
    <div className="flex flex-col max-w-3xl p-4 mx-auto">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Controller
            control={methods.control}
            name={"question"}
            defaultValue={methods.getValues("question")}
            rules={{ required: true, minLength: 1 }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Editor onChange={onChange} theme={"snow"} editorValue={value} />
            )}
          />

          <Choices />

          <Accordion className={"mt-3"}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <p>Explanation</p>
            </AccordionSummary>

            <Controller
              control={methods.control}
              name={"explanation"}
              defaultValue={methods.getValues("explanation")}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Editor
                  onChange={onChange}
                  theme={"snow"}
                  editorValue={value}
                />
              )}
            />
          </Accordion>

          <Tags />
          <button
            type="button"
            className="transition duration-200 bg-white text-black p-2 inline-block hover:text-red-500"
            onClick={() => methods.reset(defaultMCChoice)}
          >
            <div className="mx-auto">
              <TrashIcon className="inline w-6 h-6" />
              <span>Delete</span>
            </div>
          </button>

          <button className="w-auto bg-blue-500 text-white p-3">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}
