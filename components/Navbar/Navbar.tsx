import React, { useState } from "react";
import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SearchIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import { auth } from '../../config/firebaseClient';

const Navbar = (props) => {
  const user = useUser();
  const [isUsingMobileSearch, setIsUsingMobileSearch] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { q } = router.query;

  const onSubmitHandler = (data) => {
    console.log(data);
    router.push({
      pathname: "/search",
      query: { q: data.query },
    });
  };

  return (
    <nav className="bg-white">
      {isUsingMobileSearch ? (
        <div className={"flex flex-row items-center w-full h-16"}>
          <button
            className="mr-2 h-10 w-10 flex-none text-sm"
            onClick={() => setIsUsingMobileSearch(false)}
          >
            <ArrowLeftIcon className="m-auto h-5 w-5" />
          </button>
          <div className="flex-auto mr-2 items-center">
            <form
              className="flex rounded-lg items-center bg-cool-gray-100 hover:shadow-lg overflow-hidden h-12 min-w-0 max-w-3xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-400"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-300 text-gray-600 ml-1 focus:outline-none"
              >
                <SearchIcon className="m-auto h-5 w-5" />
              </button>
              <input
                type="text"
                className="flex-auto bg-transparent min-w-0 focus:outline-none p-2"
                defaultValue={q ? q : ""}
                ref={register}
                name="query"
              />
            </form>
          </div>
        </div>
      ) : (
        <div className={"border flex flex-row items-center w-full h-16"}>
          <div className="hidden lg:flex flex-none items-center h-10 w-48 mx-4">
            <Image
              src="/full-logo.svg"
              alt="Quizton"
              width={192}
              height={36}
              onClick={() => router.push("/")}
            />
          </div>

          <div className="flex lg:hidden flex-none items-center h-10 w-10 mx-4">
            <Image
              src="/logo.svg"
              alt="Quizton"
              width={36}
              height={36}
              className="block lg:hidden"
              onClick={() => router.push("/")}
            />
          </div>

          <div
            className={
              "hidden md:flex items-center flex-auto min-w-0 pr-4 justify-start"
            }
          >
            <form
              className="flex rounded-lg items-center bg-cool-gray-100 hover:shadow-lg overflow-hidden h-12 w-full min-w-0 max-w-xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-400"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-200 text-gray-600 ml-1 focus:outline-none"
              >
                <SearchIcon className="m-auto h-5 w-5" />
              </button>
              <input
                type="text"
                className="flex-auto bg-transparent min-w-0 focus:outline-none p-2"
                defaultValue={q ? q : ""}
                ref={register}
                name="query"
              />
            </form>
          </div>

          <div className={"flex md:hidden items-center flex-grow min-w-0"}>
            <button
              className="rounded-full bg-cool-gray-100 hover:bg-cool-gray-200 border h-12 w-12"
              onClick={() => setIsUsingMobileSearch(true)}
            >
              <SearchIcon className="m-auto h-5 w-5" />
            </button>
          </div>

          <div className="flex-none ml-2 mr-4">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <button className="px-2 py-1">Login</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-2 py-1">Signup</button>
                </Link>
              </> // Add profile picture
            ) : (
              <button className="px-2 py-1" onClick={() => auth.signOut()}>Signout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
