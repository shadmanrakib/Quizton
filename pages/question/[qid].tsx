import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { db } from "../../config/firebaseClient";
import { useForm, useFieldArray } from "react-hook-form";
import "katex/dist/katex.min.css"

const Question = (props) => {
  const router = useRouter();
  const { qid } = router.query;

  const { register, handleSubmit, errors, control } = useForm();

  const [voteCount, setVoteCount] = useState(props.data.upvote - props.data.downvote) 

  const onSubmit = (data) => { 
    console.log(props.data);
    fetch("/api/answerQuestion", {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        qid: props.qid,
        userAnswer: data.answer,
        correctAnswer: props.data.answer,
        isCorrect: data.answer == props.data.answer
      })
    })
    console.log(data)
  };

  return (
    
  );
};

export async function getServerSideProps(context) {
  const qid : string = Array.isArray(context.params.qid) ? context.params.qid[0] : context.params.qid;
  const docRef = db.collection("questions").doc(context.params.qid);

  const doc = await docRef.get();

  if (!doc.exists) {
    return {
      notFound: true,
    };
  }

  return {
    props: { exists: doc.exists, data: doc.data(), qid: qid},
  };
}

export default Question;
