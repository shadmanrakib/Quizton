import React, { useState } from "react";
import Navbar from "../components/Navbar/Nav2";
import {PlusIcon} from "@heroicons/react/outline";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full">
      <Navbar/>
      <button className="bg-blue-500 hover:bg-blue-600 text-white h-16 w-16 rounded-full fixed bottom-4 right-4" onClick={() => router.push("/question/create")}>
        <PlusIcon className="w-12 h-12 m-auto"/>
      </button>
    </div>
  );
};

export default index;
