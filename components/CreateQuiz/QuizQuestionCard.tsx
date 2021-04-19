import React, { useState } from "react";
import { MultipleChoiceRequest } from "../../types/quesdom";
import EditMCForm from "./EditMCForm";
import Question from "./Question";

interface props {
  onChange: (question) => void;
  value: MultipleChoiceRequest;
  isFocused: boolean;
  
}

function QuizQuestionCard(props: props) {
  return (
    <div>
      {props.isFocused ?
        <EditMCForm
        onChange={(question: MultipleChoiceRequest) => {
          props.onChange(question);
        }}
        question={props.value}/>
      : 
        <Question
          question={props.value}
        ></Question>
      }
    </div>
  );
}

export default QuizQuestionCard;
