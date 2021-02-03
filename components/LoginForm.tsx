import { useForm } from "react-hook-form";
import { auth } from "../config/firebase";

import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";

interface LoginData {
  name: string;
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          ref={register({
            required: {
              value: true,
              message: "Please enter your email",
            },
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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
      <button type="submit" className="mt-3 p-2 bg-gray-300">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
