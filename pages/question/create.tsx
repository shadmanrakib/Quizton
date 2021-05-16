import React, { useState } from "react";
import Link from "next/link";

import CreateMCForm from "../../components/CreateQuestion/Form";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Navbar from "../../components/Navbar/Navbar";

const Create: React.FC = () => {
  const [kind, setKind] =
    useState<"multipleChoice" | "shortAnswer">("multipleChoice");
  // moves the menu below the select input
  return (
    <div className="bg-cool-gray-100 min-h-screen">
      <Navbar />
      <div className="flex w-full justify-center">
        <div className="w-full max-w-5xl box-border">
          <div className="my-5">
            <Link href="/">
              <h1 className="flex items-center text-lg cursor-pointer">
                <ArrowBackIcon /> {""} Back
              </h1>
            </Link>
          </div>

          {kind === "multipleChoice" ? (
            <div>
              <CreateMCForm />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Create;
