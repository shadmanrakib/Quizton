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
          <div className="flex-grow flex mr-2 items-center min-w-0">
            <form
              className="flex rounded-lg items-center bg-cool-gray-100 overflow-hidden h-12 w-full focus-within:shadow-lg focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-200 text-gray-600 ml-2"
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
          <div className="flex flex-none items-center h-10 mx-4">
            <MediaQuery minWidth={1224}>
              <Image
                src="/full-logo.svg"
                alt="Quizton"
                width={192}
                height={36}
                onClick={() => router.push("/")}
              />
            </MediaQuery>

            <MediaQuery maxWidth={1224}>
              <Image
                src="/logo.svg"
                alt="Quizton"
                width={36}
                height={36}
                onClick={() => router.push("/")}
              />
            </MediaQuery>
          </div>

            <MediaQuery minWidth={768}>
            <div
            className={
              "flex items-center flex-grow min-w-0 pr-4 justify-start"
            }
          >
              <form
                className="flex rounded-lg items-center bg-cool-gray-100 overflow-hidden h-12 w-full min-w-0 max-w-xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200"
                onSubmit={handleSubmit(onSubmitHandler)}
              >
                <button
                  type="submit"
                  className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-200 text-gray-600 ml-2"
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
            </MediaQuery>

            <MediaQuery maxWidth={768}>
            <div
            className={
              "flex items-center flex-grow min-w-0 pr-4 justify-end"
            }
          >
              <button
                className="rounded-full border h-10 w-10"
                onClick={() => setIsUsingMobileSearch(true)}
              >
                <SearchIcon />
              </button>
              </div>
            </MediaQuery>

          <div className="flex-none mx-4">
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
