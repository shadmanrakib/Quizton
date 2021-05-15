import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SplitPlane from "../../components/Subjects/SplitPlane";
import { PageData } from "../../types/quesdom";

function Subject() {
  const [page, setPage] = useState<PageData | null>(null);
  const router = useRouter();
  const { subject } = router.query;

  useEffect(() => {
    if (!subject) return;
    fetch(`/SubjectPageJSON/${subject}.json`)
      .then((res) => res.json())
      .then((res) => setPage(res));
  }, [subject]);
  return (
    <div className="bg-gray-200">
      <Navbar></Navbar>
      {page && (
        <main>
          <div className="w-full px-4 pb-10 pt-10 bg-blue-500 text-white ">
            <div className="flex flex-col">
              <p className="text-gray-200 text-lg">{page.subject}</p>
              <p className="font-bold text-3xl">{page.title}</p>
            </div>
          </div>
          {page.topics.map((topic) => {
            const half = Math.floor((topic.subtopics.length + 1) / 2);
            const left = topic.subtopics.slice(0, half);
            const right = topic.subtopics.slice(half, topic.subtopics.length);

            return (
              <SplitPlane
                image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
                title={topic.title}
                left={left}
                right={right}
                key={topic.title}
              />
            );
          })}
        </main>
      )}
    </div>
  );
}

export default Subject;
