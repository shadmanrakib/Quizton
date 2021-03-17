import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "../hooks/useUser";
import { auth } from "../config/firebaseClient";
//import App from "../components/TestEditor";

const Editor = dynamic(() => import('../components/TestEditor').catch(() => console.log("Failed to dynamically load editor")), {ssr: false})

export default function Home() {
  const user = useUser();

  const handleSignOut = async () => {
    try {
      return await auth.signOut();
    } catch (err) {
      return err;
    }
  };

  return (
    <div>
      {user && <h1>You are logged in with {user.email}</h1>}

      <ul className="ml-8 list-disc">
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="/signup">
            <a>SignUp</a>
          </Link>
        </li>
        <li>
          <Link href="/search">
            <a>Search</a>
          </Link>
        </li>
        <li>
          <Link href="/create">
            <a>Create Quiz</a>
          </Link>
        </li>
      </ul>

      {user && (
        <button onClick={handleSignOut} className="mt-3 p-2 bg-gray-300">
          Sign Out
        </button>
      )}

      <Editor />
    </div>
   
  );
}
