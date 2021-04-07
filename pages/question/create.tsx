import React, { useState } from "react";
import Link from "next/link";

import CreateMCForm from "../../components/CreateQuestion/CreateMCForm";
import { MenuProps } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Dropdown from "../../components/CreateQuestion/Dropdown";

const Create: React.FC = () => {
  const [kind, setKind] = useState<"multipleChoice" | "shortAnswer">(
    "multipleChoice"
  );
  // moves the menu below the select input
  return (
    <div className="flex justify-center my-10">
      
      <div className="container mx-36 box-border">
        <div className="my-5">
          <Link href="/">
            <h1 className="flex items-center text-lg cursor-pointer"><ArrowBackIcon /> Back</h1>
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
  );
};
export default Create;
