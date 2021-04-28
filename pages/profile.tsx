import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
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
    });
  });

  //Get user document
  if (!user || !userClaims) return <p></p>;
  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <Navbar></Navbar>
      <div className="flex flex-col mx-auto max-w-3xl">
        <div className="bg-white shadow-sm h-36 rounded-2xl my-6 flex flex-row">
          <img src={user.photoURL} className="rounded-full"></img>
          <p>{userClaims.username}</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
