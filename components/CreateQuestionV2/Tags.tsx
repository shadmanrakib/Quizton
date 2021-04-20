import React, { useState } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Chip from "@material-ui/core/Chip";

export default function Tags() {
  const { register, control } = useFormContext(); // retrieve all hook methods
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `tags`, // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const [inputControl, setInputControl] = useState<string>("");

  return (
    <div className="my-2 flex flex-col">
      <div>
        <input
          type="text"
          value={inputControl}
          className="p-2 bg-gray-50 border"
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
      </div>
      <div className="flex flex-row flex-wrap">
        {fields.map((field, index) => {
          return (
            <Controller
              key={field.id}
              defaultValue={field.value}
              control={control}
              name={`tags.${index}.value` as const}
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
          );
        })}
      </div>
    </div>
  );
}
