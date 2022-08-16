export type Comment = {
  id?: number;
  body?: string;
  user_id?: number;
  parent_id?: number | null;
  createdAt?: Date;
};

export type CommentCreateInfo = {
  body: string;
  user_id: number;
  post_id: number;
  parent_id: number | null;
  createdAt: Date;
};

export type CommentResult = Promise<Comment | null>;
export type CommentResultArray = Promise<Comment[] | null>;

export type CommentRepository = {
  findById: (id: number) => CommentResult;
  findByUserId: (userId: number) => CommentResultArray;
  findBetweenDate: (start: Date, end: Date) => CommentResultArray;
  findByPostId: (id: number) => CommentResultArray;
  findByParentId: (parentId: number) => CommentResult;
  create: (commentInfo: CommentCreateInfo) => CommentResult;
  deleteById: (id: number) => CommentResult;
  deleteAllByUserId: (userId: number) => Promise<{ count: number } | null>;
  deleteAll: () => Promise<{ count: number } | null>;
};
