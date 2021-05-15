import React, { useEffect, useRef, useState } from "react";
import { db } from "../../config/firebaseClient";
import { useUser } from "../../hooks/useUser";
import { Quiz, RecentThingsBatch, Question } from "../../types/quesdom";
import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import { Menu } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
import RecentQuizCard from "./RecentQuizCard";
import {
  QuizRecentData,
  QuestionRecentData,
  SearchRecentData,
} from "../../types/quesdom";
import Dropdown from "./Dropdown";
import { useRouter } from "next/router";
import RecentQuestionCard from "./RecentQuestionCard";

import UserQuizCard from "./UserQuizCard";
import UserQuestionCard from "./UserQuestionCard";

interface props {
  uid: string;
}

function StudySets({ uid }: props) {
  const [paginating, setPaginating] = useState<boolean>(false);
  const user = useUser();
  const router = useRouter();
  //This is for recentQuestions, recentSearches, and recentQuizzes
  const [latestDocRef, setLatestDocRef] =
    useState<QueryDocumentSnapshot<RecentThingsBatch>[] | null | "empty">(null);
  //This is for questions and quizzes (the ones that were made by the current user)

  const [userQuestions, setUserQuestions] =
    useState<QueryDocumentSnapshot<Question>[] | null | "empty">(null);

  const [userQuizzes, setUserQuizzes] =
    useState<QueryDocumentSnapshot<Quiz>[] | null | "empty">(null);

  const [mode, setMode] =
    useState<
      | "recentQuestions"
      | "recentQuizzes"
      | "recentSearches"
      | "quizzes"
      | "questions"
    >("recentQuizzes");
  //This takes care of recentQuestions, recentSearches, and recentQuizzes
  //To do: Pagination. Right now it just shows past few recents
  useEffect(() => {
    if (!user) return;
    if (
      !(
        mode === "recentQuestions" ||
        mode === "recentQuizzes" ||
        mode === "recentSearches"
      )
    )
      return;
    let mounted = true;
    db.collection("users")
      .doc(uid)
      .collection(mode)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get()
      .then((querySnap) => {
        if (!mounted) return; //It is an error to setState on an unmounted element
        if (querySnap.empty) {
          setLatestDocRef("empty");
          return;
        }
        setLatestDocRef([
          querySnap.docs[0] as QueryDocumentSnapshot<RecentThingsBatch>,
        ]);
      });
    return () => {
      mounted = false;
    };
  }, [mode, user]);
  //This takes care of user created quizzes and questions
  useEffect(() => {
    if (!user) return;
    if (!(mode === "questions" || mode === "quizzes")) return;
    let mounted = true;
    db.collection(mode)
      .where("author.uid", "==", uid)
      .orderBy("date", "desc")
      .limit(10)
      .get()
      .then((querySnap) => {
        if (!mounted) return;
        if (querySnap.empty && mode === "questions") setUserQuestions("empty");
        if (querySnap.empty && mode === "quizzes") setUserQuestions("empty");
        if (mode === "questions")
          setUserQuestions(querySnap.docs as QueryDocumentSnapshot<Question>[]);
        if (mode === "quizzes")
          setUserQuizzes(querySnap.docs as QueryDocumentSnapshot<Quiz>[]);
      });
  }, [mode, user]);

  useEffect(() => {
    if (!user) return;
    function scrollHandler(e) {
      if (paginating) {
        console.log("Locked");
        return;
      }
      if (
        window.innerHeight + Math.ceil(window.pageYOffset) >=
        document.body.offsetHeight
      ) {
        if (mode === "quizzes") {
          if (userQuizzes === "empty" || userQuizzes === null) return;
          setPaginating(true);
          db.collection(mode)
            .where("author.uid", "==", uid)
            .orderBy("date", "desc")
            .startAfter(userQuizzes[userQuizzes.length - 1])
            .limit(5)
            .get()
            .then((querySnap) => {
              setUserQuizzes((currentQuizzes) => {
                if (currentQuizzes === "empty" || querySnap.empty)
                  return currentQuizzes;
                setPaginating(false);

                return currentQuizzes.concat(
                  querySnap.docs as QueryDocumentSnapshot<Quiz>[]
                );
              });
            })
            .catch(() => setPaginating(false));
        }
        if (mode === "questions") {
          if (userQuestions === "empty" || userQuestions === null) return;
          setPaginating(true);
          db.collection(mode)
            .where("author.uid", "==", uid)
            .orderBy("date", "desc")
            .startAfter(userQuestions[userQuestions.length - 1])
            .limit(5)
            .get()
            .then((querySnap) => {
              setUserQuizzes((currentQuestions) => {
                if (currentQuestions === "empty" || querySnap.empty)
                  return currentQuestions;
                setPaginating(false);

                return currentQuestions.concat(
                  querySnap.docs as QueryDocumentSnapshot<Quiz>[]
                );
              });
            })
            .catch(() => setPaginating(false));
        }
      }
    }
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [mode, userQuestions, userQuizzes, paginating, user]);

  return (
    <div className="">
      <section className="mb-4 mt-4">
        <Dropdown
          //The dropdown looks different depending on whether its your profile or someone else's

          itemClicked={(str) => {
            setMode(str);
          }}
          uid={uid}
        ></Dropdown>
      </section>
      {(mode === "recentQuizzes" ||
        mode === "recentQuestions" ||
        mode === "recentSearches") &&
        latestDocRef === "empty" && <p>No Recent Activity</p>}
      {(mode === "recentQuizzes" ||
        mode === "recentQuestions" ||
        mode === "recentSearches") &&
        latestDocRef !== "empty" &&
        latestDocRef !== null &&
        flattenData(latestDocRef)
          .reverse()
          .slice(0, 10)
          .map((val, index) => {
            if (
              //User wants to view recent multiple choice questions
              val.kind === "multipleChoice" &&
              val.question.kind === "multipleChoice"
            ) {
              return (
                <RecentQuestionCard val={val} key={index}></RecentQuestionCard>
              );
            } else if (val.kind === "quiz") {
              return <RecentQuizCard val={val} key={index}></RecentQuizCard>;
            } else if (val.kind === "search") {
              return <div key={index}>{val.query}</div>;
            }
          })}
      {mode === "questions" && userQuestions && userQuestions === "empty" && (
        <p>Empty</p>
      )}
      {mode === "questions" &&
        userQuestions &&
        userQuestions !== "empty" &&
        userQuestions.map((val, index) => {
          return (
            <UserQuestionCard
              val={val.data()}
              qid={val.id}
              key={index}
            ></UserQuestionCard>
          );
        })}
      {mode === "quizzes" && userQuizzes && userQuizzes === "empty" && (
        <p>Empty</p>
      )}
      {mode === "quizzes" &&
        userQuizzes &&
        userQuizzes !== "empty" &&
        userQuizzes.map((val, index) => {
          return (
            <UserQuizCard
              val={val.data()}
              qid={val.id}
              key={index}
            ></UserQuizCard>
          );
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
