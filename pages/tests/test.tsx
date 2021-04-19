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
        {...register('firstName', {
          validate: (value) => (value ? "True case" : "False case"),
        })}
        type="text"></input>
    </div>
  );
}

export default test;
