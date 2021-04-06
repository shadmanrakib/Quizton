import { Chip } from "@material-ui/core";
import React, { useState } from "react";
import {
  Control,
  FieldValues,
  useFieldArray,
  Controller,
} from "react-hook-form";

interface props {
  control: Control<FieldValues>;
}
function Tags({ control }: props) {
  const tagsField = useFieldArray({
    control,
    name: "tags",
  });
  const [inputControl, setInputControl] = useState<string>("");
  return (
    <React.Fragment>
      <div>
        <div className="mt-6">Tags</div>
        <input
          className=" w-48 h-9 border-2 box-border border-radius rounded pl-2 border-gray"
          type="text"
          value={inputControl}
          onChange={(e) => setInputControl(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.currentTarget.value === "") return;
              tagsField.append({ value: inputControl });
              setInputControl("");
            }
          }}
        ></input>
        <div
          onClick={() => {
            if (inputControl !== "") {
              tagsField.append({ value: inputControl });
              setInputControl("");
            }
          }}
          className="bg-light-blue-200 p-2 ml-3 inline-block select-none rounded-md"
        >
          + Add Tag
        </div>
      </div>
      <div className="inline-flex flex-wrap">
        {tagsField.fields.map((field, index) => {
          return (
            <Controller
              key={field.id}
              defaultValue={field.value}
              control={control}
              name={`tags[${index}].value`}
              render={(
                { onChange, onBlur, value, name, ref },
                { invalid, isTouched, isDirty }
              ) => {
                return (
                  <div className="mx-1 my-1">
                    <Chip
                      key={field.id}
                      label={field.value}
                      onDelete={() => tagsField.remove(index)}
                    ></Chip>
                  </div>
                );
              }}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default Tags;
