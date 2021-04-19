import React from "react";
import CreateFormV2 from "../../components/CreateQuiz/CreateFormV2";
import Navbar from "../../components/Navbar/Navbar";

function create() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar/>
      <CreateFormV2/>
    </div>
  );
}

export default create;
