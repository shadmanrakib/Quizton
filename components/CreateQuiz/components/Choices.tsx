import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import Editor from "../../Editor";
import ClearIcon from "@material-ui/icons/Clear";

const Choices = ({ nestIndex, control, register, getValues }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions[${nestIndex}].answerChoices`,
  });

  return (
    <div>
      <div className="mt-6">Choices</div>
      <div className="text-sm">Select the correct answer choice</div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} className="border">
            <div className="flex flex-row">
              <input
                type="radio"
                name="correctAnswer"
                value={k}
                className="my-auto ml-3 mr-1"
                ref={register}
              ></input>
              <div className="flex-auto">
                <Controller
                  control={control}
                  name={`questions[${nestIndex}].answerChoices[${k}].value`}
                  defaultValue={item.value}
                  render={({ onChange, onBlur, value }) => (
                    <Editor
                      onChange={onChange}
                      theme={"bubble"}
                      defaultSetValue={value}
                      tabIndex={0}
                    />
                  )}
                />                
              </div>
              <button
                type="button"
                className="transition duration-200 bg-white text-black p-2 inline-block hover:text-red-500"
                onClick={() => remove(k)}
              >
                <ClearIcon />
              </button>
            </div>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ value: "" })}>
        Add Choice
      </button>

      <hr />
    </div>
  );
};

export default Choices;
