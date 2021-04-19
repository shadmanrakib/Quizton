import Tags from "./Tags";
import React, { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Editor from "../Editor";
import Choices from "./Choices";
import { Question, MultipleChoiceRequest } from "../../types/quesdom";
import { Accordion, AccordionSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";


const CreateMCForm: React.FC = ({control, register, errors, questionIndex, setValue, getValues}) => {
  return (
    <form
      className="flex flex-col mx-auto"
    >
      <label className="mt-6 mb-3" htmlFor="question">
        Question
        <span className={`${errors.question ? "text-red-500" : "hidden"}`}>
          {" "}
          This field is required
        </span>
      </label>
      <Controller
        control={control}
        name="question"
        defaultValue={control.getValues("question")}
        rules={{ required: true, minLength: 1 }}
        render={({ onChange, onBlur, value }) => (
          <div className={`bg-white ${errors.question ? "bg-red-50" : ""}`}>
            <Editor
              onChange={onChange}
              theme={"snow"}
              defaultSetValue={value}
            />
          </div>
        )}
      />

      <Choices control={control}></Choices>
      <Accordion className={"mt-3"}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p>Explanation</p>
        </AccordionSummary>

        <Controller
          control={control}
          name="explanation"
          defaultValue={control.getValues("explanation")}
          render={({ onChange, onBlur, value }) => (
            <div
              className={`bg-white ${errors.explanation ? "bg-red-50" : ""}`}
            >
              <Editor
                onChange={onChange}
                theme={"snow"}
                tabIndex={0}
                defaultSetValue={value}
              />
            </div>
          )}
        />
      </Accordion>

      <Tags control={control}></Tags>
    </form>
  );
};

export default CreateMCForm;
