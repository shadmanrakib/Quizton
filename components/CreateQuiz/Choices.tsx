import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Editor from "../Editor";
import { XIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";

export default function Choices({ questionIndex }) {
  const { register, control } = useFormContext(); // retrieve all hook methods
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `questions.${questionIndex}.answerChoices`, // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );
  return (
    <>
      <div className="mt-6">Choices</div>
      <div className="text-sm">Select the correct answer choice</div>
      {fields.map((field: { id: string; value: string }, index) => {
        return (
          <div key={field.id} className="border flex flex-row w-auto">
            <input
              type="radio"
              value={index}
              className="my-auto ml-3 mr-1"
              {...register(`questions.${questionIndex}.correctAnswer`)}
            />
            <div className="flex-auto">
              <Controller
                control={control}
                name={`questions.${questionIndex}.answerChoices.${index}.value`}
                defaultValue={field.value}
                rules={{ required: true, minLength: 1 }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Editor
                    onChange={onChange}
                    theme={"bubble"}
                    editorValue={value}
                  />
                )}
              />
            </div>

            <button
              type="button"
              className="transition duration-200 bg-white text-black p-2 inline-block hover:text-red-500"
              onClick={() => remove(index)}
            >
              <XIcon className="m-auto w-6 h-6" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="p-2 bg-blue-400 text-white"
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
