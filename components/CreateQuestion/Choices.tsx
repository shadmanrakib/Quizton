import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Editor from "../Editor";
import { XIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";

export default function Choices() {
  const { register, control } = useFormContext(); // retrieve all hook methods
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `answerChoices`, // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );
  return (
    <>
      <div className="mt-6 text-lg font-semibold">Choices</div>
      <div className="text-md mb-2">Select the correct answer choice</div>
      {fields.map((field: { id: string; value: string }, index) => {
        return (
          <div key={field.id} className="w-full flex flex-row">
            <input
              type="radio"
              value={index}
              className="my-auto w-1/12"
              {...register("correctAnswer")}
            />
            <div className="w-10/12 flex-grow-0">
              <Controller
                control={control}
                name={`answerChoices.${index}.value` as "answerChoices.0.value"}
                defaultValue={field.value}
                rules={{ required: true, minLength: 1 }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Editor
                    className="bg-white max-w-full rounded-md flex-none border my-1"
                    onChange={onChange}
                    theme={"bubble"}
                    editorValue={value}
                  />
                )}
              />
            </div>
            <button
              type="button"
              className="transition duration-200  text-black p-2 inline-block hover:text-red-500"
              onClick={() => remove(index)}
            >
              <XIcon className="m-auto w-6 h-6" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="p-2 bg-blue-400 text-white rounded-md mt-3"
        onClick={() => append({ value: "" })}
      >
        <div className="mx-auto">
          <PlusIcon className="inline w-6 h-6" />
          <span>Add Choice</span>
        </div>
      </button>
    </>
  );
}
