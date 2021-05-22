import React, { useState, useEffect, useContext } from "react";
import * as quesdom from "../../types/quesdom";
import { auth, db } from "../../config/firebaseClient";
import { useUser } from "../../hooks/useUser";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import postData from "../../utility/postData";
import { ReactContext } from "./TopicPage";
interface QuestionComponentProps {
  data: quesdom.multipleChoice;
  qid: string;
}
async function getUserVoteKind(
  props: QuestionComponentProps
): Promise<"upvote" | "downvote" | "none" | undefined> {
  const user = auth.currentUser;
  if (!auth.currentUser) {
    return;
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

function Votebar(props: QuestionComponentProps) {
  const user = useUser();
  const context = useContext(ReactContext);
  console.log(context.voteData);

  const [vote, setVote] = useState<undefined | "upvote" | "downvote" | "none">(
    () => {
      return context.voteData.voteKinds[context.activeIndex];
    }
  );
  const [voteCount, setVoteCount] = useState(
    context.voteData.voteCounts[context.activeIndex] === undefined
      ? props.data.upvotes - props.data.downvotes
      : context.voteData.voteCounts[context.activeIndex]
  );
  console.log("VoteCount", voteCount, vote);
  function onUpvote() {
    console.log(vote);
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("upvote");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "upvote";
        copy.voteCounts[context.activeIndex] = voteCount + 1;
        return copy;
      });
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("none");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "none";
        copy.voteCounts[context.activeIndex] = voteCount - 1;
        return copy;
      });
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 2);
      setVote("upvote");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "upvote";
        copy.voteCounts[context.activeIndex] = voteCount + 2;
        return copy;
      });
    }
  }
  function onDownvote() {
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("downvote");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "downvote";
        copy.voteCounts[context.activeIndex] = voteCount - 1;
        return copy;
      });
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("none");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "none";
        copy.voteCounts[context.activeIndex] = voteCount + 1;
        return copy;
      });
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 2);
      setVote("downvote");
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = "downvote";
        copy.voteCounts[context.activeIndex] = voteCount - 2;
        return copy;
      });
    }
  }
  useEffect(() => {
    let stillMounted = true;
    if (vote) return;
    getUserVoteKind(props).then((kind) => {
      if (stillMounted) setVote(kind);
      context.setVoteData((copy) => {
        copy.voteKinds[context.activeIndex] = kind;
        return copy;
      });
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Votebar;
