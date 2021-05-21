import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import StudySets from "../components/Profile/StudySets";
import { db } from "../config/firebaseClient";
import { useUser } from "../hooks/useUser";

import * as quesdom from "../types/quesdom";
import postData from "../utility/postData";

function Profile() {
  const user = useUser();
  const router = useRouter();

  let { uid } = router.query;
  const [queryUID, setQueryUID] = useState<string | undefined>(undefined);

  const [userInfo, setUserInfo] = useState({
    username: null,
    photoURL: null,
    displayName: null,
  });
  console.log("Outisde UID reading", uid);
  useEffect(() => {
    console.log("Inside UID reading", uid);
    setQueryUID(uid as string);
  }, [uid]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    //If the query uid matches the user's uid, then the person is on his own profile.
    //setStrangersProfile(false), because the profile is the user's own profile
    if (user.uid === uid) {
      user.getIdTokenResult().then((t) => {
        if (mounted) {
          setUserInfo((object) => {
            const updatedOne = { ...object };
            updatedOne.username = (t.claims as quesdom.CustomClaims).username;
            updatedOne.displayName = user.displayName;
            updatedOne.photoURL = user.photoURL;
            return updatedOne;
          });
        }
      });
    } else {
      //User is looking at another user's profile
      //We need to get the username, photoURL, and displayName of the stranger from from the serverless api
      const requestData: quesdom.UserInfoRequest = { uid: uid as string };

      postData("/api/userInfo", requestData).then(
        (res: quesdom.UserInfoResponse) => {
          setUserInfo({
            displayName: res.displayName,
            photoURL: res.photoURL,
            username: res.username,
          });
        }
      );
    }
  }, [user, queryUID]);

  return (
    <div className="bg-gray-200 min-h-screen overflow-hidden">
      <Navbar></Navbar>

      <div className="bg-white">
        <div className="flex flex-row mx-auto bg-white h-36 max-w-full px-4 sm:px-12 xl:max-w-7xl">
          <img
            src={userInfo.photoURL}
            className="rounded-full self-center mr-6 hidden md:block"
            width="70px"
            height="70px"
          ></img>
          <img
            src={userInfo.photoURL}
            className="rounded-full self-center mr-3 md:hidden"
            width="50px"
            height="50px"
          ></img>
          <div className="flex flex-col self-center">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {userInfo.username}
            </h1>
            <p className="font-medium text-gray-500">{userInfo.displayName}</p>
          </div>
        </div>
      </div>
      <div className=" bg-white h-8">
        <div className="flex flex-row  px-4 max-w-full sm:px-12 xl:max-w-7xl mx-auto">
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
      </div>
      <section className="mx-auto px-4 max-w-full sm:px-12 xl:max-w-7xl">
        {queryUID && <StudySets uid={queryUID} key={queryUID}></StudySets>}
      </section>
    </div>
  );
}

export default Profile;
