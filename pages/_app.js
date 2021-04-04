import "../styles/globals.css";
import { useRouter } from "next/router";
import { UserProvider } from "../hooks/useUser";
import { auth } from "../config/firebaseClient";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    auth.onIdTokenChanged((user) => {
      if (user) {
        user.getIdTokenResult(false).then((token) => {
          if (!token.claims.registered) router.push("/auth/getstarted");
        });
      }
    });
  }, []);
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
