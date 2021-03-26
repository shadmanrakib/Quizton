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
    <div>
      <div>{voteCount}</div>
      <button onClick={() => setVoteCount(voteCount + 1)}>Upvote</button>
      <button onClick={() => setVoteCount(voteCount - 1)}>Downvote</button>
      <div className="my-3">
        Tags:
        {props.data.tag.map((tag, index) => (
          <span key={ index } className="px-3 py-2 m-2 border rounded-md bg-light-blue-300">
            {tag}
          </span>
        ))}
      </div>
      <div>Question: 
        <div className="" dangerouslySetInnerHTML={{__html: props.data.question}}>

        </div>
      </div>
      <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
        {props.data.answerChoices.map((choice, index) => (
          <div key={ index }>
            <input
              type="radio"
              id={"choice" + index}
              name="answer"
              ref={register}
              value={index}
            ></input>
            <label htmlFor={"choice" + index} dangerouslySetInnerHTML={{__html: choice}}></label>
          </div>
        ))}
        <button className="my-3 p-3 bg-primary text-white" type="submit">Check Answer</button>
      </form>
    </div>
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
