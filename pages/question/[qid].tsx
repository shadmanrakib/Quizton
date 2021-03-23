import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";

import { db } from "../../config/firebaseClient";
import { useUser } from '../../hooks/useUser';
import 'katex/dist/katex.min.css';
// import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.13.0/dist/contrib/auto-render.mjs";


// interface AuthorInfo {
//   uid: string;
//   name: string;
//   profilePicture?: string;
// }

// interface Data {
//   question: string;
//   explanation: string;
//   choices: Array<string>;
//   tags: Array<string>;
//   answer: number;
//   author: AuthorInfo;
//   date?: any;
// }


const Question = (props) => {
  const router = useRouter();
  const { qid } = router.query;
  const user = useUser();

  const { register, handleSubmit, errors, control } = useForm();

  const [voteCount, setVoteCount] = useState(props.data.upvote - props.data.downvote) 
  const [ isCorrect, setIsCorrect ] = useState<boolean | null>(null);


  useEffect(() => {
    if (user) {
      const uid = user.uid;
      console.log(qid);
      const questionAnsweredRef = db
      .collection("users")
      .doc(uid)
      .collection('questionsAnswered')
      .doc(qid);
    
      questionAnsweredRef.get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            setIsCorrect(data.isCorrect);
          }
        })
    }
    

  }, [user])


  const onSubmit = (data) => { 
    const isCorrect = data.answer == props.data.correctAnswer;
    setIsCorrect(isCorrect);
    fetch("/api/answerQuestion", {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        qid,
        userAnswer: data.answer,
        correctAnswer: props.data.correctAnswer,
        isCorrect
      })
    })
    console.log(data)
  };

  return (
    <div>

      {/* <div>{voteCount}</div>
      <button onClick={() => setVoteCount(voteCount + 1)}>Upvote</button>
      <button onClick={() => setVoteCount(voteCount - 1)}>Downvote</button> */}
      {isCorrect !== null && <> { isCorrect ? <div className="p-3 bg-green-500">Correct</div> : <div className="p-3 bg-red-500">Incorrect</div>} </> }
      <div className="my-3">
        Tags:
        {props.data.tag.map((tag, index) => (
          <span key={ index } className="px-3 py-2 m-2 border rounded-md bg-light-blue-300">
            { tag }
          </span>
        ))}
      </div>
      <div>
        <p>Question</p>
        <div dangerouslySetInnerHTML={{ __html: props.data.question }}></div>
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
  const docRef = db.collection("questions").doc(context.params.qid);

  const doc = await docRef.get();

  if (!doc.exists) {
    return {
      notFound: true,
    };
  }

  return {
    props: { exists: doc.exists, data: doc.data(), qid: context.params.qid },
  };
}

export default Question;
