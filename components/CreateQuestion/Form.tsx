import React from "react";
import {
  useForm,
  FormProvider,
  Controller,
  NestedValue,
} from "react-hook-form";
import Editor from "../Editor";
import { Accordion, AccordionSummary } from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";
import { TrashIcon } from "@heroicons/react/outline";
import Tags from "./Tags";
import Choices from "./Choices";
import router from "next/router";
import postData from "../../utility/postData";

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

export default function Form() {
  const methods = useForm<QuestionTS>({
    defaultValues: defaultMCChoice,
  });
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/createQuestion", data).then((response) => {
      console.log(response);
      router.push("/");
    });
  };

  return (
    <>
      <div className="flex flex-col max-w-3xl p-4 mx-auto">
        <p className="text-xl font-semibold mb-5">Create a Question</p>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Controller
              control={methods.control}
              name={"question"}
              defaultValue={methods.getValues("question")}
              rules={{ required: true, minLength: 1 }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <div className="bg-white">
                  <Editor
                    onChange={onChange}
                    theme={"snow"}
                    editorValue={value}
                  />
                </div>
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

            <button className="w-auto bg-blue-500 text-white px-4 py-2 rounded-md">
              Submit
            </button>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
