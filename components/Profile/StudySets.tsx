import React, { useEffect, useState } from "react";
import { db } from "../../config/firebaseClient";
import { useUser } from "../../hooks/useUser";
import { RecentThingsBatch } from "../../types/quesdom";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import { Menu } from "@headlessui/react";
import {
  QuizRecentData,
  QuestionRecentData,
  SearchRecentData,
} from "../../types/quesdom";
import Dropdown from "./Dropdown";
import { useRouter } from "next/router";

function StudySets() {
  const user = useUser();
  const router = useRouter();
  const [latestDocRef, setLatestDocRef] = useState<
    QueryDocumentSnapshot<RecentThingsBatch>[] | null | "empty"
  >(null);
  const [mode, setMode] = useState<
    | "recentQuestions"
    | "recentQuizzes"
    | "recentSearches"
    | "quizzes"
    | "questions"
  >("recentQuestions");
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    db.collection("users")
      .doc(user.uid)
      .collection(mode)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get()
      .then((querySnap) => {
        if (querySnap.empty) {
          setLatestDocRef("empty");
          return;
        }
        setLatestDocRef([
          querySnap.docs[0] as QueryDocumentSnapshot<RecentThingsBatch>,
        ]);
        console.log(querySnap.docs);
      });
    return () => {
      mounted = false;
    };
  }, [mode, user]);
  return (
    <div className="">
      <section className="mb-4 mt-4">
        <Dropdown
          itemClicked={(str) => {
            setMode(str);
            console.log(str);
          }}
        ></Dropdown>
      </section>
      {latestDocRef === "empty" && <p>No Recent Activity</p>}
      {latestDocRef !== "empty" &&
        latestDocRef !== null &&
        flattenData(latestDocRef)
          .reverse()
          .slice(0, 5)
          .map((val, index) => {
            if (
              val.kind === "multipleChoice" &&
              val.question.kind === "multipleChoice"
            ) {
              const correctAnswer = val.question.correctAnswer;
              return (
                <div
                  key={index}
                  className="shadow-sm bg-white p-4 my-4 rounded-lg cursor-pointer hover:shadow-lg"
                  onClick={() => {
                    router.push("/question/" + val.qid);
                  }}
                >
                  <section
                    dangerouslySetInnerHTML={{ __html: val.question.question }}
                    className="overflow-hidden mb-2"
                  ></section>
                  {val.question.answerChoices.map((html, key) => {
                    return (
                      <>
                        <div className="flex flex-row items-center">
                          <input
                            readOnly={true}
                            type="radio"
                            value={key + ""}
                            checked={correctAnswer === key}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          ></input>
                          <section
                            className={`rounded-md px-1 my-2 overflow-hidden inline-block mx-2 ${
                              correctAnswer === key ? "bg-green-200" : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: html }}
                          ></section>
                        </div>
                      </>
                    );
                  })}
                </div>
              );
            } else if (val.kind === "quiz") {
              return <div key={index}>{val.quiz.title}</div>;
            } else if (val.kind === "search") {
              return <div key={index}>{val.query}</div>;
            }
          })}
    </div>
  );
}

function flattenData(
  arr: QueryDocumentSnapshot<RecentThingsBatch>[]
): (QuizRecentData | QuestionRecentData | SearchRecentData)[] {
  return arr
    .map((val) => {
      return val.data().dataArray;
    })
    .flat();
}

export default StudySets;
