import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { auth } from "../../config/firebaseClient";
import { useRouter } from "next/router";

export default function AccountDropdown() {
  const user = useUser();
  const router = useRouter();
  return (
    <div className="w-10 h-10">
      <Menu as="div" className="relative inline-block text-right">
        {({ open }) => (
          <>
            <div className="w-9 h-9">
              <Menu.Button as={Fragment}>
                <img
                  src={user ? user.photoURL : "/public/defaultProfile"}
                  className="rounded-full"
                  width="100%"
                  height="100%"
                ></img>
              </Menu.Button>
            </div>
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
                className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y z-50 divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          router.push({
                            pathname: "/profile",
                            query: { uid: user.uid },
                          });
                        }}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <span>Profile</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          auth.signOut();
                        }}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <span>Sign Out</span>
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
