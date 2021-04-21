import { useState, useEffect } from "react";
import { db, auth } from "../../config/firebaseClient";
import "katex/dist/katex.min.css";
import Question from "../../components/Question";
import Navbar from "../../components/Navbar/Navbar";
import EditMCForm from "../../components/CreateQuestion/EditMCForm";
import firebase from "firebase/app";
import { SettingsRemoteRounded } from "@material-ui/icons";
import { useUser } from "../../hooks/useUser";
import * as quesdom from "../../types/quesdom";
import Votebar from "../../components/Votebar";

const QuestionPage = (props) => {
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [question, setQuestion] = useState<quesdom.multipleChoice>(props.data);

  const user = useUser();

  if (user && correct === null) {
    const { uid } = auth.currentUser;
    db.collection("users")
      .doc(uid)
      .collection("questionsAnswered")
      .doc(props.qid)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data) {
          setCorrect(data.isCorrect);
        }
      });
  }

  const onSubmit = (data) => {
    const isCorrect = data.answer == question.correctAnswer;
    setCorrect(isCorrect);

    fetch("/api/answerQuestion", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        qid: props.qid,
        userAnswer: data.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      }),
    });
  };
  return (
    <div className="min-h-screen bg-cool-gray-100 w-full">
      <Navbar />
      <div className="container mx-auto">
        {correct && (
          <div className="my-3 p-3 rounded-md bg-green-500 text-white text-lg">
            You have successfully completed this question!
          </div>
        )}
        {correct === false && (
          <div className="my-3 p-3 rounded-md bg-red-500 text-white text-lg">
            Please try again.
          </div>
        )}
      </div>
      <Votebar
        data={question as quesdom.multipleChoice}
        onEditButtonClicked={() => {
          setMode("edit");
        }}
        qid={props.qid}
        mode={mode}
      ></Votebar>
      {mode === "view" && (
        <Question
          onSubmit={onSubmit}
          data={question as quesdom.multipleChoice}
          qid={props.qid}
          onEditButtonClicked={() => {
            setMode("edit");
          }}
        />
      )}

      {mode === "edit" && (
        <div className={"max-w-6xl mx-auto"}>
          <EditMCForm
            question={question}
            qid={props.qid}
            onEdit={(question) => {
              let newQuestion: quesdom.multipleChoice = { ...props.data };
              newQuestion.explanation = question.explanation;
              newQuestion.question = question.question;
              if (newQuestion.kind === "multipleChoice") {
                newQuestion.answerChoices = question.answerChoices;
                newQuestion.tags = question.tags;
                newQuestion.correctAnswer = question.correctAnswer;
              }
              console.log("Made QUESTION", newQuestion);
              setQuestion(newQuestion);
              setMode("view");
            }}
          ></EditMCForm>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const qid: string = Array.isArray(context.params.qid)
    ? context.params.qid[0]
    : context.params.qid;
  console.log(context.params.qid);
  const docRef = db.collection("questions").doc(context.params.qid);

  const doc = await docRef.get();

  if (!doc.exists) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      exists: doc.exists,
      data: JSON.parse(JSON.stringify(doc.data())),
      qid: qid,
    },
  };
}

export default QuestionPage;
