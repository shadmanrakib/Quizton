import React, { useState, Fragment } from "react";
import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { SearchIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import AccountDropdown from "./AccountDropdown";
import SearchTypeDropdown from "./SearchTypeDropdown";
import ClassDropdown from "./ClassDropdown";
import CreateDropdown from "./CreateDropdown";

const Navbar = (props) => {
  const user = useUser();
  const [isUsingMobileSearch, setIsUsingMobileSearch] = useState(false);

  const { register, handleSubmit, control, getValues } = useForm();
  const router = useRouter();
  const { q } = router.query;

  const onSubmitHandler = (data) => {
    console.log(data);
    router.push({
      pathname: "/search",
      query: { q: data.query, type: data.type },
    });
  };

  return (
    <nav className="bg-white h-16 w-full flex flex-row px-4 md:px-8">
      {isUsingMobileSearch ? (
        <div className="flex flex-auto items-center h-16 bg-white z-50">
          <button
            className="mr-2 h-10 w-10 flex-none text-sm"
            onClick={() => setIsUsingMobileSearch(false)}
          >
            <ArrowLeftIcon className="m-auto h-5 w-5" />
          </button>
          <div className="flex-grow">
            <form
              className="flex rounded-lg border items-center bg-cool-gray-100 hover:shadow-lg h-10 min-w-0 max-w-2xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-2"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <Controller
                control={control}
                name={"type"}
                defaultValue={"quiz"}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <SearchTypeDropdown
                    selectedType={value}
                    setSelectedType={onChange}
                  />
                )}
              />
              <input
                type="text"
                className="flex-auto bg-transparent min-w-0 focus:outline-none px-4 p-2"
                defaultValue={q ? q : ""}
                {...register("query")}
              />
              <button
                type="submit"
                className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-300 text-gray-600 focus:outline-none"
              >
                <SearchIcon className="m-auto h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="h-full mr-4 flex items-center">
            <Image
              src="/logo.svg"
              alt="Quizton"
              width={40}
              height={40}
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex flex-auto items-center overflow-none">
            <div className="flex-auto">
              {!isUsingMobileSearch && (
                <form
                  className="hidden sm:flex border rounded-lg items-center bg-cool-gray-100 hover:shadow-lg h-10 min-w-0 max-w-2xl focus-within:shadow-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-2"
                  onSubmit={handleSubmit(onSubmitHandler)}
                >
                  <Controller
                    control={control}
                    name={"type"}
                    defaultValue={"quiz"}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <SearchTypeDropdown
                        selectedType={value}
                        setSelectedType={onChange}
                      />
                    )}
                  />

                  <input
                    type="text"
                    className="flex-auto bg-transparent min-w-0 focus:outline-none px-4 p-2"
                    defaultValue={q ? q : ""}
                    {...register("query")}
                  />
                  <button
                    type="submit"
                    className="rounded-full flex-none h-10 w-10 hover:bg-cool-gray-300 text-gray-600 focus:outline-none"
                  >
                    <SearchIcon className="m-auto h-5 w-5" />
                  </button>
                </form>
              )}
              <button
                className="sm:hidden float-right rounded-full bg-cool-gray-100 hover:bg-cool-gray-200 border h-10 w-10"
                onClick={() => setIsUsingMobileSearch(true)}
              >
                <SearchIcon className="m-auto h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center mx-4">
            {!user ? (
              <>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 mr-2 hidden md:block w-20 bg-gray-200 rounded-lg">
                    Signup
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="px-4 py-2 bg-brand-1 md:w-20 text-white rounded-lg">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex flex-row select-none ">
                <div className="self-center mx-3 md:ml-2 hidden md:block">
                  <CreateDropdown></CreateDropdown>
                </div>
                <div className="self-center  ml-2 mr-4 md:ml-3 md:mr-5">
                  <div className="flex flex-row mb-1">
                    <ClassDropdown></ClassDropdown>
                  </div>
                </div>
                <AccountDropdown></AccountDropdown>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </nav>
  );
};

export default Navbar;
