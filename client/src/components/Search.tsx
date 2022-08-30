const Search: React.FC = () => {
  return (
    <form className="p-2 flex gap-2">
      <input
        className="p-2 rounded-sm w-full text-black"
        type="text"
        placeholder="Search"
      />
      <button
        className="p-2 rounded-md bg-blue-500 text-white transition ease-in hover:bg-blue-400"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
