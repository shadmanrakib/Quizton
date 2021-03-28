import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUser } from "../hooks/useUser";
import Editor from "./Editor";

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

  const tagsField = useFieldArray({
    control,
    name: "tags",
  });
  const choicesField = useFieldArray({
    control,
    name: "choices",
  });

  const onSubmit = (data) => {
    console.log(data);
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

        <div className="mt-6">Choices</div>
        <div className="text-sm">Select the correct answer choice</div>

        {choicesField.fields.map((field, index) => (
          <div className="border" key={field.id}>
            <div className="flex">
              <input
                type="radio"
                name="answer"
                value={index}
                className="my-auto"
                ref={register}
              ></input>
              <div className="flex-auto">
                <Controller
                  control={control}
                  name={`choices[${index}].value`}
                  defaultValue={field.value}
                  render={({ onChange, onBlur, value }) => (
                    <Editor onChange={onChange} theme={"bubble"} />
                  )}
                />
              </div>
            </div>
            {/* <input
              className="border p-2 bg-blueGray-100"
              name={`choices[${index}].value`}
              ref={register()} // register() when there is no validation rules
              defaultValue={field.value} // make sure to include defaultValue
            /> */}
            <button
              type="button"
              className="bg-red-500 text-white p-2"
              onClick={() => choicesField.remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-light-blue-200 p-2"
          onClick={choicesField.append}
        >
          + Add Choice
        </button>

        <label className="mt-6" htmlFor="explanation">
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

        <div className="mt-6">Tags</div>
        {tagsField.fields.map((field, index) => (
          <div className="border" key={field.id}>
            <input
              className="border p-2 bg-blueGray-100"
              name={`tags[${index}].value`}
              ref={register()} // register() when there is no validation rules
              defaultValue={field.value} // make sure to include defaultValue
            />
            <button
              type="button"
              className="bg-red-500 text-white p-2"
              onClick={() => tagsField.remove(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bg-light-blue-200 p-2"
          onClick={tagsField.append}
        >
          + Add Tag
        </button>

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
