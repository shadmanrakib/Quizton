import React, { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import Editor from "../Editor";

function Choices() {
  const { control, register } = useFormContext();
  const choicesField = useFieldArray({ name: "choices", control: control });
  return (
    <div>
      <div className="mt-6">Choices</div>
      <div className="text-sm">Select the correct answer choice</div>

      {choicesField.fields.map(
        (field: { id: string; value: string }, index) => (
          <div className="border bg-white" key={field.id}>
            <div className="flex">
              <input
                type="radio"
                value={index}
                className="my-auto ml-3 mr-1"
                {...register("answer")}
              ></input>
              <div className="flex-grow w-9/12">
                <Controller
                  control={control}
                  name={`choices.${index}.value` as "choices.0.value"}
                  defaultValue={field.value}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Editor
                      onChange={onChange}
                      theme={"bubble"}
                      value={value}
                      tabIndex={0}
                    />
                  )}
                />
              </div>
              <button
                type="button"
                className="transition duration-200 bg-white text-black p-2 inline-block hover:text-red-500"
                onClick={() => choicesField.remove(index)}
              >
                <ClearIcon />
              </button>
            </div>
          </div>
        )
      )}
      <button
        type="button"
        className="bg-blue-300 p-2 mt-3"
        onClick={() => {
          choicesField.append({ value: "" });
        }}
      >
        + Add Choice
      </button>
    </div>
  );
}

export default Choices;
