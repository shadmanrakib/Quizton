import React, { useState } from "react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { firebaseAdmin } from "../../config/firebaseAdmin";

import * as quesdom from "../../types/quesdom";
import Quiz from "../../components/ViewQuiz/Quiz";
import Navbar from "../../components/Navbar/Navbar";
import { useUser } from "../../hooks/useUser";
import Form from "../../components/CreateQuiz/Form";

export const getServerSideProps = async (context) => {
  const { qid } = context.params;
  const quizDocument = await firebaseAdmin
    .firestore()
    .doc("/quizzes/" + qid)
    .get();
  const {
    author,
    date,
    questions,
    title,
  } = quizDocument.data() as quesdom.Quiz;
  const quiz: quesdom.Quiz = {
    author: JSON.parse(JSON.stringify(author)),
    date: JSON.parse(JSON.stringify(date)),
    questions: JSON.parse(JSON.stringify(questions)),
    title: JSON.parse(JSON.stringify(title)),
  };
  return {
    props: {
      initialQuizData: quiz,
      qid: qid as string, //Assumes context.params is just one string
    },
  };
};

function QuizUI({
  initialQuizData,
  qid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = useUser();
  const [quiz, setQuiz] = useState<quesdom.Quiz>(initialQuizData);
  const [mode, setMode] = useState<"view" | "edit">("view");
  if (process.browser && user) console.log(user.uid, quiz.author.uid);
  return (
    <>
      <div className="bg-gray-200 min-h-screen overflow-hidden">
        <Navbar></Navbar>
        <div className="flex flex-col max-w-3xl p-4 mx-auto">
          <div className="p-4 md:p-8 bg-white rounded-2xl shadow -mb-4">
            <p>{quiz.title}</p>
            <p>
              By: {quiz.author.username} | {quiz.date}
            </p>
            {user && user.uid === quiz.author.uid && (
              <p
                className="hover: underline text-cool-gray-400 cursor-pointer"
                onClick={() => {
                  mode === "view" ? setMode("edit") : setMode("view");
                }}
              >
                {mode === "view"
                  ? "Edit your quiz"
                  : "Forget about editing! Take me back."}
              </p>
            )}
          </div>
        </div>
        {mode === "view" && <Quiz quiz={quiz} qid={qid}></Quiz>}
        {mode === "edit" && (
          <Form
            editQuizProps={{
              defaultQuizValues: {
                questions: quiz.questions as quesdom.multipleChoice[],
                title: quiz.title,
              },
              qid: qid,
              onEditFinished: (newQuizRequest) => {
                setMode("view");
                let newQuiz: quesdom.Quiz = { ...quiz };
                newQuiz.questions = newQuizRequest.questions.map(
                  (newQuestion) => {
                    if (newQuestion.kind === "multipleChoice") {
                      let multipleChoice: quesdom.multipleChoice = {
                        kind: "multipleChoice",
                        answerChoices: newQuestion.answerChoices,
                        author: quiz.author,
                        correctAnswer: newQuestion.correctAnswer,
                        date: new Date().toString(),
                        downvotes: 0, //Quiz questions do not have upvotes nor downvotes
                        upvotes: 0,
                        explanation: newQuestion.explanation,
                        question: newQuestion.question,
                        tags: newQuestion.tags,
                        votes: 0,
                      };
                      return multipleChoice;
                    }
                  }
                );
                newQuiz.title = newQuizRequest.title;
                newQuiz.date = new Date().toString();
                setQuiz(newQuiz);
              },
            }}
          ></Form>
        )}
      </div>
    </>
  );
}

export default QuizUI;
