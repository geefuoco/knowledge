export type User = {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: Date;
};

export type UserCreateInfo = {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  avatar: string | null;
  bio: string | null;
};

export type UserUpdateInfo = {
  bio?: string | null;
  avatar?: string | null;
};

export type UserResult = Promise<User | null>;
export type UserResultArray = Promise<User[] | null>;

export type UserRepository = {
  findById: (id: number, password: boolean) => UserResult;
  findAll: () => UserResultArray;
  findByEmail: (email: string) => UserResult;
  findByUsername: (username: string) => UserResultArray;
  findByIdWithPosts: (id: number) => UserResult;
  getUserLikes: (id: number) => UserResult;
  updateUser: (id: number, userInfo: UserUpdateInfo) => UserResult;
  findByDateBetween: (start: Date, end: Date) => UserResultArray;
  create: (userInfo: UserCreateInfo) => UserResult;
  deleteById: (id: number) => UserResult;
  deleteAll: () => Promise<{ count: number } | null>;
  login: (email: string, password: string) => UserResult;
};
