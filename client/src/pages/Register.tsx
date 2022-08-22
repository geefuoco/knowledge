import { FormEvent, useRef, useState } from "react";
import Form, { FormErrors } from "../components/Form";
import TextInput from "../components/Input";

const labelClasses = "text-xl font-bold text-white drop-shadow";

const Register: React.FC = () => {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const confirmPassword = useRef<HTMLInputElement | null>(null);
  const submit = useRef<HTMLButtonElement | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: FormEvent) => {
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
      console.log("Passwords dont match");
      setErrors({
        password: "Passwords don't match",
        confirmPassword: "Passwords don't match",
        ...errors,
      });
      return;
    }
    setErrors({});
    button.disabled = false;
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
        {errors && errors["password"] && (
          <span className="text-red-500 font-bold">{errors["password"]}</span>
        )}
        <div className="flex justify-between gap-10">
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
        {errors && errors["confirmPassword"] && (
          <span className="text-red-500 font-bold">
            {errors["confirmPassword"]}
          </span>
        )}
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
