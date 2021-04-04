import React, { useState } from "react";
import CreateMCForm from "../../components/CreateQuestion/CreateMCForm";
import { MenuProps } from "@material-ui/core";
import Dropdown from "../../components/CreateQuestion/Dropdown";

const Create: React.FC = () => {
  const [kind, setKind] = useState<"multipleChoice" | "shortAnswer">(
    "multipleChoice"
  );
  // moves the menu below the select input
  return (
    <div className="flex justify-center h-screen">
      <div className="container mt-10 box-border">
        <Dropdown
          onChange={(kind) => {
            setKind(kind);
          }}
        ></Dropdown>
        {kind === "multipleChoice" ? (
          <div>
            <CreateMCForm></CreateMCForm>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Create;
