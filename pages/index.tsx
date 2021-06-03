import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import BottomNavbar from "../components/Navbar/BottomNavbar";
import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import StudySets from "../components/Profile/StudySets";
import { useUser } from "../hooks/useUser";
import Recommendations from "../components/Index/RecommendationCarousel/Recommendations";
import Link from "next/link";
import Image from "next/image";

const index = () => {
  const router = useRouter();
  const user = useUser();

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Navbar />

      {user ? (
        <main>
          <Recommendations />

          <div className="bg-white w-screen py-6">
            <section className="px-4">
              <p className="text-3xl">Your Library</p>
            </section>
          </div>

          <section className="px-4">
            <StudySets uid={user.uid}></StudySets>
          </section>
        </main>
      ) : (
        <main className="px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-2 items-center py-8">
            <div className="flex flex-1 flex-col">
              <div className="font-bold text-5xl pb-8">
                Need to practice for your exams?
              </div>
              <div className="text-2xl pb-8">
                Use{" "}
                <span className="text-brand-1 font-bold">
                  Quizton's vast library
                </span>{" "}
                of quizzes and questions for free today.
              </div>
              <Link href="/auth/signup">
                <button className="px-3 py-3 mt-2 w-36 rounded-lg bg-brand-1 text-xl text-white">
                  Get Started
                </button>
              </Link>
            </div>
            <div className="none md:block md:flex-1">
              <Image
                src="/landingPageIllustration1.svg"
                alt="Illustration of someone studying"
                height={789}
                width={1089}
                layout="responsive"
              />
            </div>
          </div>
        </main>
      )}

      <BottomNavbar />
    </div>
  );
};

export default index;

{
  /* <button
        className="bg-blue-500 hover:bg-blue-600 text-white h-16 w-16 rounded-full fixed bottom-4 right-4"
        onClick={() => router.push("/question/create")}
      >
        <PlusIcon className="w-12 h-12 m-auto" />
      </button> */
}
