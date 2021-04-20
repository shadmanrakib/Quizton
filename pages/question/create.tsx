import React, { useState } from "react";
import Link from "next/link";

import CreateMCForm from "../../components/CreateQuestionV2/Form";
import { MenuProps } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Dropdown from "../../components/CreateQuestionV2/Dropdown";
import Navbar from "../../components/Navbar/Navbar";

const Create: React.FC = () => {
  const [kind, setKind] = useState<"multipleChoice" | "shortAnswer">(
    "multipleChoice"
  );
  // moves the menu below the select input
  return (
    <div className="bg-cool-gray-100">
      <Navbar />

      <div className="flex w-full justify-center">
        <div className="w-full max-w-5xl p-4 box-border">
          <div className="my-5">
            <Link href="/">
              <h1 className="flex items-center text-lg cursor-pointer">
                <ArrowBackIcon /> {""} Back
              </h1>
            </Link>
          </div>
          <Dropdown
            onChange={(kind) => {
              setKind(kind);
            }}
          ></Dropdown>
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
