import { useSearchParams } from "react-router-dom";
import { searchUsers } from "../api/searchUsers";
import type { User } from "../config/types";
import { useAsync } from "../hooks/useAsync";
import UserSearchItem from "./UserSearchItem";

const SearchResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const {
    loading,
    error,
    value: users,
  } = useAsync(() => searchUsers(username as string), [username]);

  if (loading) {
    return <h1 className="text-center text-xl font-bold">Loading</h1>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const userDisplay =
    (users as User[]) &&
    users.map((user: User) => <UserSearchItem key={user.id} user={user} />);
  return (
    <div className="container mx-auto md:w-2/3 lg:w-2/5">
      {users.length > 0 ? (
        userDisplay
      ) : (
        <h2 className="p-2 text-center italic text-xl">No users found</h2>
      )}
    </div>
  );
};

export default SearchResult;
