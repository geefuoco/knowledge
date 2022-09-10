export type Post = {
  id?: number;
  body?: string;
  createdAt?: Date;
  user_id?: number;
};

export type PostCreateInfo = {
  body: string;
  image?: string;
  createdAt: Date;
  user_id: number;
};

export type PostResult = Promise<Post | null>;
export type PostResultArray = Promise<Post[] | null>;

export type PostRepository = {
  findById: (id: number) => PostResult;
  findByIdWithComments: (id: number) => PostResult;
  findAll: () => PostResultArray;
  findByUserId: (userId: number) => PostResultArray;
  findAllWithCommentCount: (page: number) => PostResultArray;
  findBetweenDate: (start: Date, end: Date) => PostResultArray;
  create: (postInfo: PostCreateInfo) => PostResult;
  deleteById: (id: number) => PostResult;
  deleteAllByUserId: (userId: number) => Promise<{ count: number } | null>;
  deleteAll: () => Promise<{ count: number } | null>;
};
