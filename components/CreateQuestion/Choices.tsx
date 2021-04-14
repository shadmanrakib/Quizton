import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import Editor from "../Editor";

interface props {
  control: Control;
}

function Choices({ control }: props) {
  const choicesField = useFieldArray({ name: "choices", control: control });
  return (
    <div>
      <div className="mt-6">Choices</div>
      <div className="text-sm">Select the correct answer choice</div>

      {choicesField.fields.map((field, index) => (
        <div className="border bg-white" key={field.id}>
          <div className="flex">
            <input
              type="radio"
              name="answer"
              value={index}
              className="my-auto ml-3 mr-1"
              ref={control.register()}
            ></input>
            <div className="flex-grow w-9/12">
              <Controller
                control={control}
                name={`choices[${index}].value`}
                defaultValue={control.getValues(`choices[${index}].value`)}
                render={({ onChange, onBlur, value }) => (
                  <Editor
                    onChange={onChange}
                    theme={"bubble"}
                    defaultSetValue={value}
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
      ))}
      <button
        type="button"
        className="bg-blue-300 p-2 mt-3"
        onClick={choicesField.append}
      >
        + Add Choice
      </button>
    </div>
  );
}

export default Choices;
