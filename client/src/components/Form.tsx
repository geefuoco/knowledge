import { FormEvent } from "react";

type Props = {
  options: FormOptions;
  children: React.ReactNode;
};

export type FormErrors = {
  [key: string]: string;
};

export type FormOptions = {
  method: "get" | "post";
  onSubmit: (e: FormEvent) => void;
};
const Form: React.FC<Props> = ({ options, children }) => {
  return (
    <form
      className="mt-20 h-fit flex flex-col justify-center p-4 bg-slate-400 gap-5 rounded-lg"
      onSubmit={options.onSubmit}
      method={options.method}
    >
      {children}
    </form>
  );
};

export default Form;
