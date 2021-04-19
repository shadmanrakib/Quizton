import React, { useState } from "react";
import {useFormContext, useFieldArray} from "react-hook-form";
import { PlusIcon } from "@heroicons/react/outline";
import EditQuestion from "./EditQuestion";
import RenderQuestion from "./RenderQuestion";

export default function Questions({defaultMCChoice}) {
  const { register, control } = useFormContext(); // retrieve all hook methods
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "questions", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const [focusedQuestion, setFocusedQuestion] = useState(0);

  return (
    <div className="">
      {fields.map((field, index) => (
        <div className={`p-8 bg-white my-4 rounded-2xl hover:shadow-2xl ${focusedQuestion && "border-l-4 border-blue-200"}`} key={field.id}>
          {focusedQuestion === index ?
           <EditQuestion remove={remove} field={field} index={index} />
          :
           <RenderQuestion field={field} index={index} />
          }
        </div>
      ))}
      <button
        type="button"
        className="p-2 bg-blue-400 text-white"
        onClick={() => {
          append(defaultMCChoice);
        }}
      >
        <div className="mx-auto"><PlusIcon className="inline w-6 h-6"/><span>Add Question</span></div>
      </button>
    </div>
  );
}

