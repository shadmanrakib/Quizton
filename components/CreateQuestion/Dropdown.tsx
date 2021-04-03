import React, { useEffect, useState } from "react";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CreateIcon from "@material-ui/icons/Create";
const multipleChoice = (
  <span className="">
    <RadioButtonCheckedIcon fontSize="small" className="mb-1" />{" "}
    {"Multiple Choice"}
  </span>
);
const shortAnswer = (
  <span className="">
    <CreateIcon fontSize="small" className="mb-1" /> {"Short Answer"}
  </span>
);

interface props {
  onChange: (kind: "shortAnswer" | "multipleChoice") => void;
}
export default function Dropdown({ onChange }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const [kind, setKind] = useState<"multipleChoice" | "shortAnswer">(
    "multipleChoice"
  );
  useEffect(() => {
    onChange(kind);
  }, [kind]);
  return (
    <>
      <div className="group inline-block">
        <button
          className="outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center"
          onClick={() => {
            setOpen(true);
          }}
        >
          <span className="pr-1 font-normal flex-1">
            {kind === "multipleChoice" ? multipleChoice : shortAnswer}
          </span>
          <span>
            <svg
              className={`fill-current h-4 w-4 ${
                open
                  ? "transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                  : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </span>
        </button>
        <ul
          className={`bg-white border rounded-sm absolute transform scale-0 group-hover:scale-100 transition duration-150 ease-in-out origin-top min-w-32 ${
            open ? "" : "hidden"
          }`}
        >
          <li
            className="rounded-sm px-3 py-1 hover:bg-gray-100 select-none min-w-32"
            onClick={() => {
              setKind("multipleChoice");
              setOpen(false);
            }}
          >
            {multipleChoice}
          </li>
          <li
            className="rounded-sm px-3 py-1 hover:bg-gray-100 select-none min-w-32"
            onClick={() => {
              setKind("shortAnswer");
              setOpen(false);
            }}
          >
            {shortAnswer}
          </li>
        </ul>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n  /* since nested groupes are not supported we have to use \n     regular css for the nested dropdowns \n  */\n  li>ul                 { transform: translatex(100%) scale(0) }\n  li:hover>ul           { transform: translatex(101%) scale(1) }\n  li > button svg       { transform: rotate(-90deg) }\n  li:hover > button svg { transform: rotate(-270deg) }\n\n  /* Below styles fake what can be achieved with the tailwind config\n     you need to add the group-hover variant to scale and define your custom\n     min width style.\n  \t See https://codesandbox.io/s/tailwindcss-multilevel-dropdown-y91j7?file=/index.html\n  \t for implementation with config file\n  */\n  .group:hover .group-hover\\:scale-100 { transform: scale(1) }\n  .group:hover .group-hover\\:-rotate-180 { transform: rotate(180deg) }\n  .scale-0 { transform: scale(0) }\n  .min-w-32 { min-width: 8rem }\n",
        }}
      />
    </>
  );
}
