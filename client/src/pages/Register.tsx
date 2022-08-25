import { FormEvent, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { registerUser } from "../api/register";
import Form from "../components/Form";
import TextInput from "../components/Input";
import { useAuth } from "../hooks/useAuth";

const labelClasses = "text-xl font-bold text-white drop-shadow";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const confirmPassword = useRef<HTMLInputElement | null>(null);
  const submit = useRef<HTMLButtonElement | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const { user, onLogin } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailInput = email.current;
    const passwordInput = password.current;
    const confirmPasswordInput = confirmPassword.current;
    const button = submit.current;

    if (!emailInput || !passwordInput || !confirmPasswordInput || !button) {
      console.error("Error: Could not find input elements");
      return;
    }

    button.disabled = true;

    if (passwordInput.value !== confirmPasswordInput.value) {
      setErrors(["Passwords don't match", ...errors]);
      button.disabled = false;
      return;
    }

    const status = await registerUser(emailInput.value, passwordInput.value);
    if (status === 201) {
      const error = await onLogin(emailInput.value, passwordInput.value);
      if (error) {
        setErrors([
          ...errors,
          "There was a problem logging in after sign up. Please logging in at the login form",
        ]);
      }
      navigate("/", { replace: true });
    }
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
          Sign Up
        </h1>
        <br />
        <div className="flex justify-between gap-5">
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
        <div className="flex justify-between gap-5">
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
        <div className="flex justify-between gap-5">
          <label htmlFor="confirm-password" className={labelClasses}>
            Confirm Password
          </label>
          <TextInput
            myref={confirmPassword}
            type="password"
            required={true}
            name="confirm-password"
          />
        </div>
        {errors &&
          errors.map((msg, idx) => (
            <span className="text-red-500 font-bold" key={idx}>
              {msg}
            </span>
          ))}
        <button
          className="rounded-md py-4 px-8 bg-blue-400 text-xl text-white hover:bg-blue-300 transition ease-in-out duration-200"
          type="submit"
          ref={submit}
        >
          Register
        </button>
      </Form>
    </div>
  );
};

export default Register;
