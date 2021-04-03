import React, { useEffect, useState } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import Editor from "../Editor";

interface props {
  control: Control;
}

function Choices({ control }: props) {
  const [init, setInit] = useState(0);
  const choicesField = useFieldArray({ name: "choices", control: control });
  useEffect(() => {
    if (init < 4) {
      choicesField.append({});
      setInit((x) => x + 1);
    }
  }, [init]);
  return (
    <div>
      <div className="mt-6">Choices</div>
      <div className="text-sm">Select the correct answer choice</div>

      {choicesField.fields.map((field, index) => (
        <div className="border" key={field.id}>
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
                defaultValue={null}
                render={({ onChange, onBlur, value }) => (
                  <Editor
                    onChange={onChange}
                    theme={"bubble"}
                    style={{ zIndex: init === 0 ? 4 : 0 }}
                  />
                )}
              />
            </div>
            <button
              type="button"
              className="bg-white text-black p-2 inline-block"
              onClick={() => choicesField.remove(index)}
            >
              <ClearIcon></ClearIcon>
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="bg-light-blue-200 p-2"
        onClick={choicesField.append}
      >
        + Add Choice
      </button>
    </div>
  );
}

export default Choices;
