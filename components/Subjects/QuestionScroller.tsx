import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import React, { useState } from "react";
import { Question } from "../../types/quesdom";
import QuestionMini from "./QuestionMini";
interface props {
  questions: QueryDocumentSnapshot<Question>[];
  questionClicked: (index: number) => void;
  activeIndex: number;
}
function QuestionScroller({ questions, questionClicked, activeIndex }: props) {
  return (
    <div>
      {questions.map((value, index) => {
        const question = value.data();
        if (question.kind === "multipleChoice") {
          return (
            <div
              onClick={() => {
                questionClicked(index);
              }}
              key={value.id}
            >
              <QuestionMini
                qid={value.id}
                val={question}
                active={index === activeIndex}
              ></QuestionMini>
            </div>
          );
        }
      })}
    </div>
  );
}

export default QuestionScroller;
