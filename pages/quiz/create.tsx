import React from "react";
import CreateQuiz from "../../components/CreateQuiz/CreateQuiz";
import Navbar from "../../components/Navbar/Navbar";

function create() {
  return (
    <div className="bg-gray-100">
      <Navbar/>
      <CreateQuiz></CreateQuiz>
    </div>
  );
}

export default create;
