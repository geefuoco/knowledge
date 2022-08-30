import type { User } from "../config/types";

const UserSearchItem: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="p-3 shadow-md bg-gray-200 border-b-2 border-b-gray-300 flex">
      <div className="flex gap-2">
        <div className="basis-1/5">
          <img
            className="w-full"
            src={user.avatar ?? "/images/default_avatar.png"}
            alt="user avatar"
          />
        </div>
        <div className="flex-grow">
          <h2 className="md:text-xl p-3 font-bold">{user.username}</h2>
          <p className="md:text-l px-3 ">Posts: {user._count?.posts ?? "0"}</p>
          <p className="md:text-l px-3 ">
            Comments: {user._count?.comments ?? "0"}
          </p>
        </div>
        <div className="basis-1/5 flex items-end">
          <a
            className="px-2 py-1 text-l whitespace-nowrap bg-blue-500 text-white rounded-sm"
            href={`/user/${user.id}`}
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserSearchItem;
