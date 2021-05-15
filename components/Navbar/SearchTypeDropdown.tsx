import { Listbox } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

const searchTypeOptions = ["quiz", "question"];

export default function AccountDropdown({ selectedType, setSelectedType }) {
  return (
    <Listbox as={"div"} value={selectedType} onChange={setSelectedType}>
      {({ open }) => (
        <div className={`relative inline-block bg-cool-gray-200 ${open ? "rounded-tl-lg" : "rounded-l-lg"}`}>
          <Listbox.Button className="h-10 px-4">
            {selectedType == "quiz" && "Quiz"}
            {selectedType == "question" && "Question"}
          </Listbox.Button>
          {open && (
            <Listbox.Options className="absolute origin-top-right px-2 py-2 bg-white shadow-xl border rounded-b-lg rounded-tr-lg">
              {searchTypeOptions.map((searchTypeOption, index) => (
                <Listbox.Option key={index} value={searchTypeOption} className="px-4 py-1 hover:bg-blue-500 rounded hover:text-white">
                  {searchTypeOption == "quiz" && "Quiz"}
                  {searchTypeOption == "question" && "Question"}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          )}
        </div>
      )}
    </Listbox>
  );
}
