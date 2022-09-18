import { FormEvent, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import TextInput from "../components/Input";
import { updatePassword } from "../api/updatePassword";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const labelClasses = "text-xl font-bold text-white drop-shadow";

const ResetPassword: React.FC = () => {
  const { createToast } = useToast();
  const { token } = useParams();
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const submit = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const passwordInput = password.current;
    const confirmPasswordInput = confirmPassword.current;
    const button = submit.current;

    if (!passwordInput || !confirmPasswordInput || !button) {
      console.error("Error: Could not find input elements");
      return;
    }

    button.disabled = true;

    if (passwordInput.value !== confirmPasswordInput.value) {
      setErrors(["Passwords don't match", ...errors]);
      button.disabled = false;
      return;
    }
    if (!token) {
      setErrors(["Invalid token", ...errors]);
      return;
    }
    const response = await updatePassword(passwordInput.value, token);
    if (response == 200 || response == 204 || response == 203) {
      setShowMessage(true);
    } else {
      createToast("Error: Failed to update password", "danger", false);
    }
  };

  const message = (
    <div className="p3">
      <p className="text-lg font-bold">Password successfully updated.</p>
    </div>
  );

  return (
    <div className="h-full flex justify-center">
      {showMessage ? (
        message
      ) : (
        <Form
          options={{
            onSubmit: handleSubmit,
            method: "post",
          }}
        >
          <h1 className="font-bold text-3xl text-center text-white drop-shadow">
            Update Password
          </h1>
          <br />
          <div className="flex justify-between gap-4">
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
          <div className="flex justify-between gap-4">
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
            Update
          </button>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
