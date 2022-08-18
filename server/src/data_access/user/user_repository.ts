export type User = {
  id?: number;
  email?: string;
  password?: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: Date;
};

export type UserCreateInfo = {
  email: string;
  password: string;
  createdAt: Date;
  avatar: string | null;
  bio: string | null;
};

export type UserResult = Promise<User | null>;
export type UserResultArray = Promise<User[] | null>;

export type UserRepository = {
  findById: (id: number, password: boolean) => UserResult;
  findAll: () => UserResultArray;
  findByEmail: (email: string) => UserResult;
  findByIdWithPosts: (id: number) => UserResult;
  getUserLikes: (id: number) => UserResult;
  findByDateBetween: (start: Date, end: Date) => UserResultArray;
  create: (userInfo: UserCreateInfo) => UserResult;
  deleteById: (id: number) => UserResult;
  deleteAll: () => Promise<{ count: number } | null>;
  login: (email: string, password: string) => UserResult;
};
