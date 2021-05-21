import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import StudySets from "../components/Profile/StudySets";
import { useUser } from "../hooks/useUser";
import Recommendations from "../components/Index/RecommendationCarousel/Recommendations";
import SubjectCarousel from "../components/Index/SubjectCarousel/SubjectCarousel";

const index = () => {
  const router = useRouter();
  const user = useUser();
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Navbar />

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white h-16 w-16 rounded-full fixed bottom-4 right-4"
        onClick={() => router.push("/question/create")}
      >
        <PlusIcon className="w-12 h-12 m-auto" />
      </button>

      <SubjectCarousel />

      {user && <Recommendations />}

      <div className="bg-white w-screen py-6">
        <section className="px-4">
          <p className="text-3xl">Your Library</p>
        </section>
      </div>

      <section className="px-4">
        {user ? <StudySets uid={user.uid}></StudySets> : <p>You must log in to view your library</p>}
      </section>
    </div>
  );
};

export default index;
