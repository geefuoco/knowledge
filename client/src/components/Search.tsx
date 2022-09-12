import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Search: React.FC<{ callback?: () => void }> = ({ callback }) => {
  const navigate = useNavigate();
  const search = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { current } = search;
    if (!current) {
      return;
    }

    if (!current.value.length) {
      return;
    }

    navigate(`/user/search?username=${current.value}`, { replace: true });
  }
  return (
    <form className="p-2 flex gap-2" onSubmit={handleSubmit}>
      <input
        ref={search}
        className="p-2 rounded-sm w-full text-black"
        type="text"
        placeholder="Search"
      />
      <button
        className="p-2 rounded-md bg-blue-500 text-white transition ease-in hover:bg-blue-400"
        type="submit"
        onClick={callback}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
