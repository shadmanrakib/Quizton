import { useState, useEffect } from "react";
import { db, auth } from "../../config/firebaseClient";
import "katex/dist/katex.min.css";
import Question from "../../components/Question";
import Navbar from '../../components/Navbar/Navbar';

import firebase from 'firebase/app';

const QuestionPage = (props) => {

  const [correct, setCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    console.log(auth.currentUser)
    if (auth.currentUser) {
      const { uid } = auth.currentUser;
      db
        .collection("users")
        .doc(uid)
        .collection("questionsAnswered")
        .doc(props.qid)
        .get()
        .then(doc => {
          const data = doc.data();
          if (data) {
            setCorrect(data.isCorrect);
          }
        });
    }
  }, [correct]);

  const onSubmit = (data) => {
    console.log(data);
    fetch("/api/answerQuestion", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        qid: props.qid,
        userAnswer: data.answer,
        correctAnswer: props.data.answer,
        isCorrect: data.answer == props.data.correctAnswer,
      }),
    })
      .then(res => res.json())
      .then(_data => {
        setCorrect(_data);
      })
  };

  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div className="container mx-auto">
        {correct &&
          <div className="my-3 p-3 rounded-md bg-green-500 text-white text-lg">
            You have successfully completed this question!
        </div>
        }
        {correct === false &&
          <div className="my-3 p-3 rounded-md bg-red-500 text-white text-lg">
            Please try again.
        </div>
        }
      </div>
      <Question onSubmit={onSubmit} data={props.data} qid={props.qid} />
    </div>
  )
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
