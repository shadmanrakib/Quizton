import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import AddIcon from "@material-ui/icons/Add";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import Results from "../components/SearchResults/Results";

const index = () => {
  const [query, setQuery] = useState("");
  const user = useUser();
  const router = useRouter();
  
  return (
    <div className="min-h-screen w-full bg-cool-gray-50">
      <Navbar changeQuery={setQuery} />
      <Results/>
      <button className="bg-blue-500 hover:bg-blue-600 text-white h-16 w-16 rounded-full fixed bottom-4 right-4" onClick={() => router.push("/question/create")}>
        <AddIcon fontSize="large"/>
      </button>
    </div>
  );
};

export default index;
