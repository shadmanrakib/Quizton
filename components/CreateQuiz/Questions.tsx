import React, { useState, useEffect } from "react";
import {useFormContext, useFieldArray} from "react-hook-form";
import { PlusIcon } from "@heroicons/react/outline";
import EditQuestion from "./EditQuestion";
import RenderQuestion from "./RenderQuestion";

export default function Questions({defaultMCChoice}) {
  const { register, control, getValues } = useFormContext(); // retrieve all hook methods
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "questions", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const [focusedQuestion, setFocusedQuestion] = useState(0);

  useEffect(() => {
    if (focusedQuestion >= fields.length) {
      setFocusedQuestion(fields.length - 1);
    }
  }, [fields.length])


  return (
    <div className="">
      {fields.map((field, index) => (
        <div className={`p-8 bg-white my-4 rounded-2xl hover:shadow-2xl ${focusedQuestion === index && "border-l-8 border-blue-200"}`} key={field.id} onClick={() => setFocusedQuestion(index)}>          
            <div className={`${focusedQuestion === index ? "block" : "hidden"}`}>
              <EditQuestion remove={remove} field={field} index={index} />
            </div>
            <div className={`${focusedQuestion != index ? "block" : "hidden"}`}>
              {/* getValues(`questions.${index}.question`) */}
              {/* getValues(`questions.${index}.answerChoices`) */}
              <RenderQuestion question={ getValues(`questions.${index}.question`) } choices={getValues(`questions.${index}.answerChoices`)} answer={getValues(`questions.${index}.correctAnswer`)}/>
            </div>
        </div>
      ))}
      <button
        type="button"
        className="p-2 bg-blue-400 text-white"
        onClick={() => {
          append(defaultMCChoice);
          setFocusedQuestion(fields.length);
        }}
      >
        <div className="mx-auto"><PlusIcon className="inline w-6 h-6"/><span>Add Question</span></div>
      </button>
    </div>
  );
}

