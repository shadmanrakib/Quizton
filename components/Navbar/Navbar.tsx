import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import SearchIcon from "@material-ui/icons/SearchRounded";
import { useUser } from "../../hooks/useUser";
import AccountMenu from "./AccountMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBackRounded";
import IconButton from "@material-ui/core/IconButton/IconButton";

const Navbar = (props) => {
  const user = useUser();
  const [isUsingMobileSearch, setIsUsingMobileSearch] = useState(false);

  return (
    <nav>
      {isUsingMobileSearch ? (
       <div className={"border flex flex-row items-center w-full h-14"}>
          <button
            className="mx-2"
            onClick={() => setIsUsingMobileSearch(false)}
          >
            <ArrowBackIcon />
          </button>
          <div className="flex-grow flex mr-2 items-center min-w-0">
            <div className="flex border rounded overflow-hidden h-9 w-full">
              <input
                type="text"
                className="flex-auto min-w-0 focus:outline-none p-2"
              />
              <button type="submit" className="border flex-none px-3">
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={"border flex flex-row items-center w-full h-16"}>
          <div className="hidden sm:flex flex-none items-center h-10 mx-4">
            <Image
              src="/full-logo.svg"
              alt="Quizton"
              width={192}
              height={36}
            />
          </div>
          <div className="flex-none items-center h-10 mx-4 sm:hidden">
            <Image
              src="/logo.svg"
              alt="Quizton"
              width={36}
              height={36}
            />
          </div>
          <div className="hidden md:flex mx-4 items-center flex-grow min-w-0">
            <div className="flex border rounded overflow-hidden h-10 w-full min-w-0 max-w-xl">
              <input
                type="text"
                className="flex-auto min-w-0 focus:outline-none p-2"
              />
              <button type="submit" className="border px-3">
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </div>
          <div className="flex justify-end flex-grow md:hidden">
            <IconButton
              aria-label="delete"
              onClick={() => setIsUsingMobileSearch(true)}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <div className="flex-none mx-4">
            {user ? (
              <></> // Add profile picture
            ) : (
              <>
                <AccountMenu />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
