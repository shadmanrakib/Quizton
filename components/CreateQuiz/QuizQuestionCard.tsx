import React, { useState } from "react";
import { MultipleChoiceRequest } from "../../types/quesdom";
import EditMCForm from "./EditMCForm";
import Question from "./Question";

interface props {
  onEdit: (question) => void;
  value: MultipleChoiceRequest;
}

function QuizQuestionCard(props: props) {
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [question, setQuestion] = useState<MultipleChoiceRequest>({
    answerChoices: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    kind: "multipleChoice",
    question: "",
    tags: [],
  });
  return (
    <div>
      {mode === "view" && (
        <Question
          question={question}
          onEdit={() => {
            setMode("edit");
          }}
        ></Question>
      )}
      {mode === "edit" && (
        <EditMCForm
          onSubmit={(question: MultipleChoiceRequest) => {
            setQuestion(question);
            setMode("view");
          }}
          question={question}
        ></EditMCForm>
      )}
    </div>
  );
}

export default QuizQuestionCard;
