import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Fab from "@material-ui/core/Fab/Fab";
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
    <div className="min-h-screen w-screen relative bg-cool-gray-200">
      <Navbar changeQuery={setQuery} />
      <main className="">
        <Results/>
      </main>
      <button className="bg-white shadow h-16 w-16 rounded-full absolute bottom-4 right-4" onClick={() => router.push("/question/create")}>
        <AddIcon fontSize="large"/>
      </button>
    </div>
  );
};

export default index;
