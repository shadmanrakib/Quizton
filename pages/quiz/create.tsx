import React from "react";
import CreateForm from "../../components/CreateQuiz/Form";
import Navbar from "../../components/Navbar/Navbar";

function create() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar/>
      <CreateForm/>
    </div>
  );
}

export default create;
