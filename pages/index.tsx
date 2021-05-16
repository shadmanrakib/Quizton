import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {PlusIcon} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import StudySets from "../components/Profile/StudySets";
import { useUser } from "../hooks/useUser";
import Recommendations from "../components/Index/Recommendations";
import SubjectCarousel from "../components/Index/SubjectCarousel/SubjectCarousel";

const index = () => {
  const router = useRouter();
  const user = useUser();
  return (
    <div className="min-h-screen w-full">
      <Navbar/>

      <SubjectCarousel />

      <button className="bg-blue-500 hover:bg-blue-600 text-white h-16 w-16 rounded-full fixed bottom-4 right-4" onClick={() => router.push("/question/create")}>
        <PlusIcon className="w-12 h-12 m-auto"/>
      </button>

      <Recommendations />
      <div className="bg-white w-screen py-6">
        <section className="mx-auto px-4 max-w-full sm:px-12 xl:max-w-7xl">
          <p className="text-2xl font-semibold">Your Library</p>
        </section>
      </div>

      <section className="mx-auto px-4 max-w-full sm:px-12 xl:max-w-7xl">
        {user && <StudySets uid={user.uid}></StudySets>}
      </section>
    </div>
  );
};

export default index;
