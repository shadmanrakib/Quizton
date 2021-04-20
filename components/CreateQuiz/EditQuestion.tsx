import React from "react";
import Editor from "../Editor";
import {useFormContext, Controller} from "react-hook-form";
import {Accordion, AccordionSummary} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";
import { TrashIcon } from "@heroicons/react/outline";
import Tags from "./Tags"
import Choices from "./Choices"

function EditQuestion({ field, index, remove }) {
  const { control } = useFormContext(); // retrieve all hook methods
  return (
    <React.Fragment>
      <Controller
        control={control}
        name={`questions.${index}.question` as 'questions.0.question'}
        defaultValue={field.question}
        rules={{ required: true, minLength: 1 }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Editor onChange={onChange} theme={"snow"} editorValue={value} />
        )}
      />

      <Choices questionIndex={index} />

      <Accordion className={"mt-3"}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p>Explanation</p>
        </AccordionSummary>

        <Controller
          control={control}
          name={`questions.${index}.explanation` as 'questions.${index}.explanation'}
          defaultValue={field.explanation}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Editor onChange={onChange} theme={"snow"} editorValue={value} />
          )}
        />
      </Accordion>

      <Tags questionIndex={index} />
      <button type="button" className="transition duration-200 bg-white text-black p-2 inline-block hover:text-red-500" onClick={() => remove(index)}>
        <div className="mx-auto"><TrashIcon className="inline w-6 h-6"/><span>Delete</span></div>
      </button>
    </React.Fragment>
  );
}

export default React.memo(EditQuestion);
