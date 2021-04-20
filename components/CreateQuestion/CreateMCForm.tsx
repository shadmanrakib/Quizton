import Tags from "./Tags";
import React, { useEffect, useRef } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
  useFormState,
} from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import router from "next/router";
import Editor from "../Editor";
import Choices from "./Choices";
import { Accordion, AccordionSummary } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreOutlined";

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
const CreateMCForm: React.FC = () => {
  const user = useUser();

  const methods = useForm({
    defaultValues: {
      choices: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
      question: null,
      explanation: "",
      answer: "0",
    },
    shouldFocusError: true,
    reValidateMode: "onChange",
  });
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    reset,
    trigger,
    setError,
  } = methods;
  const { errors } = useFormState({ control });
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/createQuestion", data).then((response) => {
      console.log(response);
      router.push("/");
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
        defaultValue={null}
        rules={{ required: true, minLength: 1 }}
        render={({ field: { onChange, onBlur, value } }) => (
          <div className={`bg-white ${errors.question ? "bg-red-50" : ""}`}>
            <Editor
              onChange={onChange}
              theme={"snow"}
              tabIndex={0}
              value={value}
            />
          </div>
        )}
      />
      <FormProvider {...methods}>
        <Choices></Choices>
      </FormProvider>

      <Accordion className={"mt-3 -mb-3"}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p>Explanation</p>
        </AccordionSummary>

        <Controller
          control={control}
          name="explanation"
          defaultValue={getValues("explanation")}
          render={({ field: { onChange, onBlur, value } }) => (
            <div
              className={`bg-white ${errors.explanation ? "bg-red-50" : ""}`}
            >
              <Editor
                onChange={onChange}
                theme={"snow"}
                tabIndex={0}
                value={value}
              />
            </div>
          )}
        />
      </Accordion>
      <FormProvider {...methods}>
        <Tags></Tags>
      </FormProvider>

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
