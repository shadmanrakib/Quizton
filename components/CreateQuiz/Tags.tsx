import React, { useState } from "react";
import {
  useFormContext,
  useFieldArray,
  Controller,
} from "react-hook-form";
import Chip from "@material-ui/core/Chip";

export default function Tags({ questionIndex }) {
    const { register, control } = useFormContext(); // retrieve all hook methods
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
      {
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `questions.${questionIndex}.tags`, // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
      }
    );

    const [inputControl, setInputControl] = useState<string>("");

    return (
    <>
      <input 
      type="text" 
      value={inputControl}
      onChange={(e) => setInputControl(e.currentTarget.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (e.currentTarget.value === "") return;
          append({ value: inputControl });
          setInputControl("");
        }
      }}
      />
      <button
        type="button"
          onClick={() => {
            if (inputControl !== "") {
              append({ value: inputControl });
              setInputControl("");
            }
          }}
          className="bg-blue-300 p-2 ml-3 inline-block select-none rounded-md"
        >
          + Add Tag
      </button>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="border flex flex-row w-auto">
            <Controller
              key={field.id}
              defaultValue={field.value}
              control={control}
              name={`questions.${questionIndex}.tags.${index}.value`}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                return (
                  <div className="mx-1 my-1">
                    <Chip
                      key={field.id}
                      label={field.value}
                      onDelete={() => remove(index)}
                    />
                  </div>
                );
              }}
            />
          </div>
        );
      })}
      </>
    );
  }