import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { db } from "../config/firebase";
import { useUser } from "../hooks/useUser";

interface AuthorInfo {
  uid: string;
  name: string;
  profilePicture?: string;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Inputs {
  question: string;
  explanation: string;
  choices: Array<string>;
  tags: Array<string>;
  answer: number;
}

interface FinalData extends Inputs {
  author: AuthorInfo;
  date?: any;
}

const CreateMCForm: React.FC = () => {
  const user = useUser();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    reset,
    trigger,
    setError,
  } = useForm<Inputs>();

  const tagsField = useFieldArray({
    control,
    name: "tags",
  });

  const choicesField = useFieldArray({
    control,
    name: "choices",
  });

  const onSubmit = (data) => {
    const { question, answer, explanation, choices, tags } = data;
    
    console.log(user);
    let finalData: FinalData = {
      author: {
        uid: user.uid,
        name: user.displayName,
        //profilePicture
      },
      question: question,
      answer: parseInt(answer),
      explanation: explanation,
      choices: choices,
      //date: 
      tags: tags,
    };

    db.collection("questions").add({
      type: "multipleChoice",
      author: finalData.author,
      question: finalData.question,
      answer: finalData.answer,
      explanation: finalData.explanation,
      choices: finalData.choices,
      tags: finalData.tags

    });
  };

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label className="mt-6" htmlFor="question">
          Question
        </label>
        <input
          name="question"
          className="border-b-2 border-blueGray-600 bg-blueGray-100 p-2 shadow"
          placeholder="Question"
          defaultValue=""
          ref={register({ required: true })}
        />
        {errors.question && (
          <div className="text-red-500">This field is required</div>
        )}

        <div className="mt-6">Choices</div>
        <div className="text-sm">Select the correct answer choice</div>

        {choicesField.fields.map((field, index) => (
          <div className="border" key={field.id}>
            <input
              type="radio"
              name="answer"
              value={index}
              ref={register}
            ></input>
            <input
              className="border p-2 bg-blueGray-100"
              name={`choices[${index}].value`}
              ref={register()} // register() when there is no validation rules
              defaultValue={field.value} // make sure to include defaultValue
            />
            <button
              type="button"
              className="bg-red-500 text-white p-2"
              onClick={() => choicesField.remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-light-blue-200 p-2"
          onClick={choicesField.append}
        >
          + Add Choice
        </button>

        <label className="mt-6" htmlFor="explanation">
          Explanation
        </label>
        <textarea
          name="explanation"
          className="border-b-2 border-blueGray-600 bg-blueGray-100 p-2 shadow"
          placeholder="Explanation"
          defaultValue=""
          ref={register({ required: true })}
        />
        {errors.explanation && (
          <div className="text-red-500">This field is required</div>
        )}

        <div className="mt-6">Tags</div>
        {tagsField.fields.map((field, index) => (
          <div className="border" key={field.id}>
            <input
              className="border p-2 bg-blueGray-100"
              name={`tags[${index}].value`}
              ref={register()} // register() when there is no validation rules
              defaultValue={field.value} // make sure to include defaultValue
            />
            <button
              type="button"
              className="bg-red-500 text-white p-2"
              onClick={() => tagsField.remove(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bg-light-blue-200 p-2"
          onClick={tagsField.append}
        >
          + Add Tag
        </button>

        <button
          type="submit"
          className="mt-6 bg-primary text-white font-bold p-3 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateMCForm;
