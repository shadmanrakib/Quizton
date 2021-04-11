import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import SearchIcon from "@material-ui/icons/SearchRounded";
import { useUser } from "../../hooks/useUser";
import AccountMenu from "./AccountMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBackRounded";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Button from "@material-ui/core/Button/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import MediaQuery from "react-responsive";

const Navbar = (props) => {
  const user = useUser();
  const [isUsingMobileSearch, setIsUsingMobileSearch] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmitHandler = (data) => {
    console.log(data);
    router.push({
      pathname: "/",
      query: { search: data.query },
    });
  };

  return (
    <nav className="bg-white">
      {isUsingMobileSearch ? (
        <div className={"border flex flex-row items-center w-full h-16"}>
          <button
            className="mx-2"
            onClick={() => setIsUsingMobileSearch(false)}
          >
            <ArrowBackIcon />
          </button>
          <div className="flex-auto mr-2 items-center">
            <form
              className="flex rounded-lg items-center bg-cool-gray-100 hover:shadow-lg overflow-hidden h-12 min-w-0 max-w-3xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-300 text-gray-600 ml-2"
              >
                <SearchIcon />
              </button>
              <input
                type="text"
                className="flex-auto bg-transparent min-w-0 focus:outline-none p-2"
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
              className="flex rounded-lg items-center bg-cool-gray-100 hover:shadow-lg overflow-hidden h-12 w-full min-w-0 max-w-xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-200 text-gray-600 ml-2"
              >
                <SearchIcon/>
              </button>
              <input
                type="text"
                className="flex-auto bg-transparent min-w-0 focus:outline-none p-2"
                ref={register}
                name="query"
              />
            </form>
          </div>

          <div
            className={
              "flex md:hidden items-center flex-grow min-w-0"
            }
          >
            <button
              className="rounded-full bg-cool-gray-100 hover:bg-cool-gray-200 border h-12 w-12"
              onClick={() => setIsUsingMobileSearch(true)}
            >
              <SearchIcon />
            </button>
          </div>

          <div className="flex-none ml-2 mr-4">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="text">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="text">Signup</Button>
                </Link>
              </> // Add profile picture
            ) : (
              <AccountMenu />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
