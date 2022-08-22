export type InputOptions = {
  type: "email" | "password" | "text";
  required: boolean;
  placeholder?: string;
  name: string;
  myref?: React.Ref<HTMLInputElement>;
};
const TextInput: React.FC<InputOptions> = ({
  type,
  required,
  placeholder,
  name,
  myref,
}: InputOptions) => {
  return (
    <input
      className="p-3 leading-normal drop-shadow-md"
      placeholder={placeholder}
      required={required}
      type={type}
      name={name}
      ref={myref}
    />
  );
};

export default TextInput;
