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
        <input
          className=" w-48 h-9 border-2 box-border border-radius rounded pl-2 border-black "
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
          className="bg-light-blue-200 p-2 inline-block select-none"
        >
          + Add Tag
        </div>
        <div className="mt-6">Tags</div>
      </div>
      <div className="inline-flex flex-wrap">
        {tagsField.fields.map((field, index) => {
          return (
            <div className="inline">
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
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default Tags;
