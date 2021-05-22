import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SplitPlane from "../../components/Subjects/SplitPlane";
import SubjectPage from "../../components/Subjects/SubjectPage";
import TopicPage from "../../components/Subjects/TopicPage";
import { PageData, Question } from "../../types/quesdom";

function Subject() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const router = useRouter();
  const { params } = router.query;
  const subject = params && params[0];
  const topic = params && params[1];
  const subtopic = params && params[2];

  useEffect(() => {
    if (!subject || !topic) return;
    //Do initial load of questions
  }, [topic]);

  useEffect(() => {
    if (!subject || !topic || !subtopic) return;
    //Do initial load of subtopic specific questions
  }, [topic]);

  console.log(subject, topic, subtopic);
  if (subject && !topic) {
    return <SubjectPage subject={subject}></SubjectPage>;
  }
  if (subject && topic) {
    return (
      <div className="bg-gray-200">
        <TopicPage
          subject={subject}
          topic={topic}
          subtopic={subtopic}
        ></TopicPage>
      </div>
    );
  }

  return (
    <div className="bg-gray-200">
      <p>scoopde de scoop</p>
    </div>
  );
}

export default Subject;
