import Link from "next/link";
import LoginForm from "../components/LoginForm";
import GoogleSignInButton from "../components/GoogleSignInButton";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex mx-0 w-screen bg-blueGray-50">
      <div className="mt-3 mx-auto">
        <div className="text-center mt-20">
          <h2 className="mt-4 text-center text-5xl leading-9 font-bold text-black">
            Login
          </h2>
          <p className="mt-8 text-center text-md text-black">
            Don't have an account?{" "}
            <Link href="/signup">
              <a href="#" className="text-primary font-bold underline">
                Sign Up
              </a>
            </Link>
          </p>
        </div>
        <div className="mt-10 w-screen sm:w-96 p-8 border-1 bg-white shadow-xl rounded-3xl">
          <GoogleSignInButton text="Sign in with Google"/>
          <br/>
          <LoginForm />
        </div>
        <br/>
      </div>
    </div>
  );
};

export default LoginPage;
