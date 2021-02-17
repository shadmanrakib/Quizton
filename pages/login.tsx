import Link from "next/link";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useForm } from "react-hook-form";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";

interface LoginData {
  name: string;
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<LoginData>();
  const user = useUser();
  const router = useRouter();
  if (user) router.push("/");

  const login = async ({ email, password }) => {
    try {
      return await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      return err;
    }
  };

  const onSubmit = (data: LoginData) => {
    login(data);
    console.log(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-700">
      <div className="flex flex-col bg-white shadow-xl px-6 sm:px-10 py-10 rounded-lg w-full max-w-md">
        <div className="font-bold self-center text-xl sm:text-2xl uppercase text-coolGray-800">
          Login To Your Account
        </div>
        <GoogleSignInButton text="Login with Google" />
        <div className="relative mt-12 h-px bg-gray-300">
          <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
            <span className="bg-white px-4 text-xs text-gray-500 uppercase">
              Or Login With Email
            </span>
          </div>
        </div>
        <div className="mt-12">
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
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>

                <input
                  id="email"
                  type="email"
                  name="email"
                  className="text-sm sm:text-base placeholder-gray-600 pl-10 pr-4 rounded-lg border-b-2 bg-blueGray-200 border-gray-400 w-full py-3 focus:outline-none focus:border-primary"
                  placeholder="Email Address"
                  ref={register({
                    required: {
                      value: true,
                      message: "Please enter your email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
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
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  className="text-sm sm:text-base placeholder-gray-600 pl-10 pr-4 rounded-lg border-b-2 bg-blueGray-200 border-gray-400 w-full py-3 focus:outline-none focus:border-primary"
                  placeholder="Password"
                  ref={register({
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-8 -mt-4">
              <div className="flex ml-auto">
                <a
                  href="#"
                  className="inline-flex text-xs sm:text-sm text-primary hover:text-blue-700"
                >
                  Forgot Your Password?
                </a>
              </div>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-primary hover:bg-blue-700 rounded-lg py-3 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Login</span>
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
          <Link href="/signup">
            <a className="inline-flex items-center font-bold text-primary hover:text-blue-700 text-xs text-center">
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
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <span className="ml-2">Don't have an account?</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
