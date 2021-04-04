import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Fab from "@material-ui/core/Fab/Fab";
import AddIcon from "@material-ui/icons/Add";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";

const index = () => {
  const [query, setQuery] = useState("");
  const user = useUser();
  const router = useRouter();

  if (user) {
    user.getIdTokenResult(true).then((idTokenResult) => {
      if (!idTokenResult.claims.registered) {
        router.push("/auth/getstarted");
      }
      return <div></div>;
    });
  }
  return (
    <div className="min-h-screen w-screen relative">
      <Navbar changeQuery={setQuery} />
      <main className="bg-gray-500"></main>
      <Link href="/question/create">
      <button className="border h-16 w-16 rounded-full absolute bottom-4 right-4">
        <AddIcon fontSize="large"/>
      </button>
      </Link>
    </div>
  );
};

export default index;
