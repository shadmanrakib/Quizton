import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import StudySets from "../components/Profile/StudySets";
import { db } from "../config/firebaseClient";
import { useUser } from "../hooks/useUser";

import * as quesdom from "../types/quesdom";

function Profile() {
  const user = useUser();
  const router = useRouter();
  const [userClaims, setUserClaims] = useState<null | quesdom.CustomClaims>(
    null
  );
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    user.getIdTokenResult().then((t) => {
      if (mounted) setUserClaims(t.claims as quesdom.CustomClaims);
      console.log("Hello");
    });
  }, [user]);

  //Get user document
  if (!user || !userClaims) return <p></p>;
  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <Navbar></Navbar>

      <div className="flex flex-row mx-auto bg-white h-36 px-4 sm:px-28 md:px-48 lg:px-64 ">
        <img
          src={user.photoURL}
          className="rounded-full self-center mr-6"
          width="70px"
          height="70px"
        ></img>
        <div className="flex flex-col self-center">
          <h1 className="text-3xl font-medium">{userClaims.username}</h1>
          <p className="">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-row mx-auto bg-white h-8 px-4 sm:px-28 md:px-48 lg:px-64 ">
        <p className="mr-5 border-blue-500 border-b-4 hover:border-yellow-500 cursor-pointer">
          Study Sets
        </p>
        <p className="mr-5 border-blue-500 border-b-4 hover:border-yellow-500 cursor-pointer">
          Folders
        </p>
        <p className="mr-5 border-blue-500 border-b-4 hover:border-yellow-500 cursor-pointer">
          Friends
        </p>
      </div>
      <section className=" px-4 sm:px-28 md:px-48 lg:px-64 ">
        <StudySets></StudySets>
      </section>
    </div>
  );
}

export default Profile;
