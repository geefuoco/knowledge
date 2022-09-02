export type Like = {
  user_id?: number;
  post_id?: number | null;
  comment_id?: number | null;
};

export type LikeResult = Promise<Like | null>;
export type LikeResultArray = Promise<Like[] | null>;

export type LikeCreateInfo = {
  user_id: number;
  post_id?: number;
  comment_id?: number;
};

export type LikeRepository = {
  findById: (id: number) => LikeResult;
  findByUserId: (userId: number) => LikeResultArray;
  create: (likeCreateInfo: LikeCreateInfo) => LikeResult;
  deleteById: (id: number) => LikeResult;
  deleteAll: () => Promise<{ count: number } | null>;
  deleteAllByUserId: (userId: number) => Promise<{ count: number } | null>;
};
