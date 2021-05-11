import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useUser } from "../../hooks/useUser";
import { auth } from "../../config/firebaseClient";
import { useRouter } from "next/router";

export default function AccountDropdown() {
  const user = useUser();
  const router = useRouter();
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-right">
        {({ open }) => (
          <>
            <Menu.Button as={Fragment}>
              <div className="flex flex-row mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block mx-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <p className="hidden md:block">Create</p>
              </div>
            </Menu.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y  divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          router.push("/quiz/create");
                        }}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <span>Quiz</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          router.push("/question/create");
                        }}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <span>Question</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
