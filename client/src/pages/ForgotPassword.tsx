import { FormEvent, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Form from "../components/Form";
import TextInput from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getPasswordResetToken } from "../api/getPasswordResetToken";

const labelClasses = "text-xl font-bold text-white drop-shadow";

const ForgotPassword: React.FC = () => {
  const { user } = useAuth();
  const { createToast } = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { current } = emailRef;
    if (!current) {
      return;
    }
    const email = current.value;
    await getPasswordResetToken(email);
    createToast("Password reset sent", "info", true);
    setSuccessMessage(true);
  }

  const successDisplay = (
    <div className="p-3">
      <p>
        If a user with the email exists, a password reset token has been sent.
      </p>
    </div>
  );

  return (
    <div className="h-full justify-center flex">
      {successMessage ? (
        successDisplay
      ) : (
        <Form
          options={{
            onSubmit: handleSubmit,
            method: "post",
          }}
        >
          <h1 className="text-3xl text-white drop-shadow font-bold">
            Forgot Password
          </h1>
          <label className={labelClasses}>Email</label>
          <TextInput
            myref={emailRef}
            type={"email"}
            required={true}
            name={"email"}
            placeholder={"example@gmail.com"}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md"
          >
            Submit
          </button>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
