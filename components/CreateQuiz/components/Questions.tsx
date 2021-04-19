import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import NestedArray from "./NestedArray";
import Choices from "./Choices";
import Editor from "../../Editor";
import Accordion from "@material-ui/core/Accordion/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandLessOutlined";

let renderCount = 0;

export default function Fields({
  control,
  register,
  defaultMCChoice,
  defaultValues,
  getValues,
  setValue,
  errors,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  renderCount++;

  return (
    <>
      {fields.map((item, index) => {
        return (
          <div
            key={item.id}
            className="p-4 md:p-8 my-4 bg-white rounded-2xl shadow hover:shadow-2xl"
          >
            <Controller
              control={control}
              name={`questions[${index}].question`}
              defaultValue={item.question}
              rules={{ required: true, minLength: 1 }}
              render={({ onChange, onBlur, value }) => (
                <div
                  // className={`bg-white ${errors.questions[index].question ? "bg-red-50" : ""}`}
                >
                  <Editor
                    onChange={onChange}
                    theme={"snow"}
                    defaultSetValue={value}
                  />
                </div>
              )}
            />
            <Choices nestIndex={index} {...{ control, register, getValues }} />

            <Accordion className={"mt-3"}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <p>Explanation</p>
              </AccordionSummary>

              <Controller
                control={control}
                name={`questions[${index}].question`}
                defaultValue={item.explanation}
                render={({ onChange, onBlur, value }) => (
                  <div
                    // className={`bg-white ${
                    //   errors.questions[index].explanation ? "bg-red-50" : ""
                    // }`}
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

            {/* <Tags control={control}></Tags> */}
            <button type="button" onClick={() => remove(index)}>
              Delete Question
            </button>
          </div>
        );
      })}

      <div>
        <button
          type="button"
          onClick={() => {
            append({questions: "", answerChoices: {value:""}});
          }}
          className="bg-blue-300 p-3"
        >
          Add Question
        </button>
      </div>

      <span className="counter">Render Count: {renderCount}</span>
    </>
  );
}
