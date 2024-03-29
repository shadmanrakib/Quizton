import React, { useState, useEffect } from "react";
import * as quesdom from "../../types/quesdom";
import { auth, db } from "../../config/firebaseClient";
import { useUser } from "../../hooks/useUser";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
interface QuestionComponentProps {
  data: quesdom.multipleChoice;
  qid: string;
  onEditButtonClicked: () => void;
  mode: "view" | "edit";
}
async function getUserVoteKind(
  props: QuestionComponentProps
): Promise<"upvote" | "downvote" | "none" | null> {
  const user = auth.currentUser;
  if (!auth.currentUser) {
    return null;
  }
  const voteCollection = db.collection("/votes");
  const voteDocs = await voteCollection
    .where("qid", "==", props.qid)
    .where("uid", "==", user.uid)
    .get();
  if (voteDocs.empty) {
    return "none";
  }
  return (voteDocs.docs[0].data() as quesdom.voteDocument).kind;
}
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
function Votebar(props: QuestionComponentProps) {
  const user = useUser();
  const [vote, setVote] = useState<null | "upvote" | "downvote" | "none">(null);
  const [voteCount, setVoteCount] = useState(
    props.data.upvotes - props.data.downvotes
  );
  function onUpvote() {
    console.log(vote);
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("upvote");
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("none");
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 2);
      setVote("upvote");
    }
  }
  function onDownvote() {
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("downvote");
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("none");
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 2);
      setVote("downvote");
    }
  }
  useEffect(() => {
    let stillMounted = true;
    getUserVoteKind(props).then((kind) => {
      if (stillMounted) setVote(kind);
    });
    return () => {
      stillMounted = false;
    };
  }, [user]);
  return (
    <div className=" bg-cool-gray-100">
      <div className="flex max-w-6xl my-4 p-6 mx-auto">
        <div className="flex flex-col w-6 mt-3">
          <ArrowUpwardIcon
            onClick={() => onUpvote()}
            className={`${
              vote === "upvote" ? "text-green-500" : ""
            } hover:text-green-500 hover:bg-gray-200`}
          />
          <p className="text-center">{voteCount}</p>
          <ArrowDownwardIcon
            onClick={() => onDownvote()}
            className={`${
              vote === "downvote" ? "text-red-500" : ""
            } hover:text-red-500 hover:bg-gray-200`}
          />
        </div>
        <div className="mt-3 ml-3 mr-3 mb-0 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm">
              DIFFICULTY: <span className="text-red-500">{5}/5</span> |{" "}
              {props.data.author.username}
            </p>
            <div className="flex items-center">
              Tags:
              {props.data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full px-3 py-1 m-1 border bg-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {user && user.uid === props.data.author.uid && props.mode === "view" && (
            <div className="text-gray-400 text-sm">
              <p
                className="hover:underline cursor-pointer"
                onClick={() => {
                  props.onEditButtonClicked();
                }}
              >
                Edit Your Question
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Votebar;
