import Tags from "./Tags";
import React, { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import Editor from "../Editor";
import Choices from "./Choices";

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

  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    reset,
    trigger,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    postData("/api/createQuestion", data).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label className="mt-6" htmlFor="question">
          Question
        </label>
        <Controller
          control={control}
          name="question"
          defaultValue={null}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Editor onChange={onChange} theme={"snow"} />
          )}
        />
        {errors.question && (
          <div className="text-red-500">This field is required</div>
        )}
        <Choices control={control}></Choices>
        <label className="mt-6 mb-3" htmlFor="explanation">
          Explanation
        </label>
        <Controller
          control={control}
          name="explanation"
          defaultValue={null}
          rules={{ required: true }}
          render={({ onChange, onBlur, value }) => (
            <Editor onChange={onChange} theme={"snow"} />
          )}
        />
        {errors.explanation && (
          <div className="text-red-500">This field is required</div>
        )}

        <Tags control={control}></Tags>

        <button
          type="submit"
          className="mt-6 bg-primary text-white font-bold p-3 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateMCForm;
