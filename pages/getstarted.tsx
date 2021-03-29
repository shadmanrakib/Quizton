import Link from "next/link";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useForm } from "react-hook-form";
import { auth } from "../config/firebaseClient";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import nookies from "nookies";

const GetStartedPage: React.FC = () => {
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();
  const user = useUser();
  const router = useRouter();
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.registered) {
        router.push("/");
      }
    });
  }

  const onSubmit = (data) => {
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
    postData("/api/userSetup", data).then((response) => {
      console.log(response);
      const { success, message } = response;
      if (success) {
        user.getIdToken(true).then((token) => {
          nookies.set(undefined, "token", token, { path: "/" });
          router.push("/");
        });
      } else {
        if (message == "User document exists") router.push("/");
        setError("serverError", { message: message, type: "required" });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col sm:my-6 bg-white shadow-xl px-6 sm:px-10 py-10 sm:rounded-lg w-full max-w-md">
        <div className="font-bold self-center text-xl sm:text-2xl uppercase text-cool-gray-800">
          Get started by choosing a username
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="username"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                username:
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="username"
                  name="username"
                  className="text-sm sm:text-base placeholder-gray-600 pl-4 pr-4 rounded-lg border-b-2 bg-blue-gray-200 border-gray-400 w-full py-3 focus:outline-none focus:border-primary"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={() => clearErrors("serverError")}
                  ref={register({
                    required: {
                      value: true,
                      message: "Please choose a username",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 mt-1">{errors.username.message}</p>
              )}
              {errors.serverError && (
                <p className="text-red-500 mt-1">
                  {errors.serverError.message}
                </p>
              )}
            </div>
            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-primary hover:bg-blue-700 rounded-lg py-3 w-full transition duration-100 ease-in"
              >
                <span className="mr-2 uppercase">Submit</span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
