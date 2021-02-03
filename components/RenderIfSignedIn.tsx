import React from "react";
import { useUser } from "../hooks/useUser";

function RenderIfSignedIn({ children }) {
  const user = useUser();
  return <>{user && children}</>;
}

export default RenderIfSignedIn;
