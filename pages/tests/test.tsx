import React from "react";
import { db } from "../../config/firebaseClient";
import { useForm } from "react-hook-form";

function test({ hello }) {
  const { register, errors } = useForm();
  console.log(hello);
  return (
    <div>
      <p>Hello</p>
      <input
        name="firstName"
        type="text"
        ref={register({
          validate: (value) => (value ? "True case" : "False case"),
        })}
      ></input>
    </div>
  );
}

export default test;
