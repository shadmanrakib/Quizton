import "../styles/globals.css";
import { useRouter } from "next/router";
import { UserProvider } from "../hooks/useUser";
import { auth } from "../config/firebaseClient";
import { useEffect } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    auth.onIdTokenChanged((user) => {
      if (user && pathname != "/auth/getstarted") {
        user.getIdTokenResult(true).then((token) => {
          if (!token.claims.registered) router.push("/auth/getstarted");
        });
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Quesdom</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"></link>
        <meta name="msapplication-TileColor" content="#2d89ef"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
        
      </Head>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
