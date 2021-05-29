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
      if (!user) {
        router.push("/");
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Quesdom</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color="#5bbad5"
        ></link>
        <meta name="msapplication-TileColor" content="#2d89ef"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
        <meta property="og:title" content="Quizton" key="ogtitle"/>
        <meta property="og:description" content={"A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions."} key="ogdesc"/>
        <meta property="og:type" content="website" key="ogtype"/>
        <meta property="og:site_name" content="Quizton" key="ogsitename" />
        <meta property="og:url" content={"https://quizton.vercel.app/"} key="ogurl" />
        <meta property="og:image" content="/opengraphImage.png" key="ogimg"/>
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1BY1TYDHMF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments)};gtag('js', new Date());gtag('config', 'G-1BY1TYDHMF');`,
          }}
        />
      </Head>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
