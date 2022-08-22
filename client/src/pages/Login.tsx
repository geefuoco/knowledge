import { FormEvent, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Form, { FormErrors } from "../components/Form";
import TextInput from "../components/Input";
import { useAuth } from "../hooks/useAuth";

const labelClasses = "text-xl font-bold text-white drop-shadow";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const submit = useRef<HTMLButtonElement | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const { user, onLogin } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailInput = email.current;
    const passwordInput = password.current;
    const button = submit.current;

    if (!emailInput || !passwordInput || !button) {
      console.error("Error: Could not find input elements");
      return;
    }

    const error = await onLogin(emailInput.value, passwordInput.value);
    console.log(error);

    button.disabled = true;
    if (error) {
      setErrors(() => {
        return { ...errors, testing: "testing" };
      });
      console.log(errors);
    }
    button.disabled = false;
    navigate("/", { replace: true });
  };

  return (
    <div className="h-full flex justify-center">
      <Form
        options={{
          onSubmit: handleSubmit,
          method: "post",
        }}
      >
        <h1 className="font-bold text-3xl text-center text-white drop-shadow">
          Login
        </h1>
        <br />
        <div className="flex justify-between gap-10">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <TextInput
            myref={email}
            type="email"
            required={true}
            name="email"
            placeholder="example@email.com"
          />
        </div>
        {errors && errors["email"] && (
          <span className="text-red-500 font-bold">{errors["email"]}</span>
        )}
        <div className="flex justify-between gap-10">
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <TextInput
            myref={password}
            type="password"
            required={true}
            name="password"
          />
        </div>
        {errors && (
          <span className="text-red-500 font-bold">{errors["message"]}</span>
        )}
        <button
          className="rounded-md py-4 px-8 bg-blue-400 text-xl text-white hover:bg-blue-300 transition ease-in-out duration-200"
          type="submit"
          ref={submit}
        >
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;