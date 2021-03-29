import "../styles/globals.css";
import { useRouter } from "next/router";
import { UserProvider } from "../hooks/useUser";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
