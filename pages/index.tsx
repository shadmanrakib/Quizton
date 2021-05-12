import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import StudySets from "../components/Profile/StudySets";
import { useUser } from "../hooks/useUser";
import Recommendations from "../components/Index/Recommendations";

const index = () => {
  const router = useRouter();
  const user = useUser();
  return (
    <div className="min-h-screen w-full bg-cool-gray-200 overflow-hidden">
      <Navbar />

      <Recommendations></Recommendations>
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
