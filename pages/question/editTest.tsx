import React from "react";
import EditMCForm from "../../components/CreateQuestion/EditMCForm";
import { Question } from "../../types/quesdom";

const testMe: Question = {
  answerChoices: ["One", "Two", "Three", "Four"],
  author: {
    hasProfilePicture: false,
    uid: "123213",
    username: "haoitangan",
  },
  correctAnswer: 1,
  date: {},
  downvotes: 1,
  explanation: "The gods say so",
  index: 1,
  kind: "multipleChoice",
  question: "Man it is my pleasure to ask you this question right here",
  tags: ["Hello", "African", "Apartheid"],
  totalWords: 2,
  upvotes: 1,
  votes: 2222,
};
function editTest() {
  return (
    <div>
      <EditMCForm qid="" question={testMe}></EditMCForm>
    </div>
  );
}

export default editTest;
