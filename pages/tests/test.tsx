import React from "react";
import { db } from "../../config/firebaseClient";

function test({ hello }) {
  console.log(hello);
  return <div></div>;
}

export async function getServerSideProps(context) {
  const docRef = db.collection("questions").doc("hnErh4qae09twkaCH3vN");

  const doc = await docRef.get();
  return {
    props: {
      hello: JSON.parse(JSON.stringify(doc.data())),
    },
  };
}
export default test;
