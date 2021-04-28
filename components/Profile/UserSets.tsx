import React, { useState } from "react";
import { db } from "../../config/firebaseClient";
import { useUser } from "../../hooks/useUser";

function UserSets() {
  const user = useUser();

  return <div></div>;
}

export default UserSets;
