import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Editor from "../Editor";
import { Accordion, AccordionSummary } from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";
import { TrashIcon } from "@heroicons/react/outline";
import Tags from "./Tags";
import Choices from "./Choices";

const defaultMCChoice = {
  answerChoices: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  correctAnswer: "0",
  explanation: "",
  kind: "multipleChoice",
  question: "",
  tags: [],
};

export default function Form() {
  const methods = useForm({ defaultValues: defaultMCChoice });
  const onSubmit = (data) => console.log(data);

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
              name={`explanation`}
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
