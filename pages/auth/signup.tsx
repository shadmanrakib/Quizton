import Link from "next/link";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { useForm } from "react-hook-form";
import { auth } from "../../config/firebaseClient";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/router";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import LockIcon from "@material-ui/icons/Lock";

interface SignUpData {
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<SignUpData>();
  const user = useUser();
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<null | string>(null);

  if (user) router.push("/");

  const onSubmit = (data: SignUpData) => {
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        setFirebaseError(null);
      })
      .catch((err) => {
        setFirebaseError(err.message);
      });
    console.log(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col sm:my-6 bg-white shadow-xl px-6 sm:px-10 py-10 sm:rounded-lg w-full max-w-md">
        <div className="font-bold self-center text-xl sm:text-2xl uppercase text-cool-gray-800">
          Create an Account
        </div>
        <GoogleSignInButton text="Sign Up with Google" />
        <div className="relative mt-12 h-px bg-gray-300">
          <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
            <span className="bg-white px-4 text-xs text-gray-500 uppercase">
              Or Sign Up with Email
            </span>
          </div>
        </div>
        <div className="mt-12">
          {firebaseError && (
            <p className="text-red-500 mt-1">{firebaseError}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Email:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <AlternateEmailIcon />
                </div>

                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: "Please enter your email",
                    },
                  })}
                  className="text-sm sm:text-base placeholder-gray-600 pl-10 pr-4 rounded-lg border-b-2 bg-blue-gray-200 border-gray-400 w-full py-3 focus:outline-none focus:border-light-blue-500"
                  placeholder="Email Address" />
              </div>
              {errors.email && (
                <p className="text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col mb-12">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <span>
                    <LockIcon />
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  className="text-sm sm:text-base placeholder-gray-600 pl-10 pr-4 rounded-lg border-b-2 bg-blue-gray-200 border-gray-400 w-full py-3 focus:outline-none focus:border-light-blue-500"
                  placeholder="Password" />
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-light-blue-500 hover:bg-blue-700 rounded-lg py-3 w-full transition duration-100 ease-in"
              >
                <span className="mr-2 uppercase">Register</span>
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

        <div className="flex justify-center items-center mt-6">
          <Link href="/login">
            <a className="inline-flex items-center font-bold text-light-blue-500 hover:text-blue-700 text-xs text-center">
              {/* <span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span> */}
              <span className="ml-2">Have an account?</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
