export type User = {
  id: number;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
  posts?: Post[];
  comments?: Comment[];
  likes: Like[];
  _count?: {
    posts?: number;
    comments?: number;
    likes?: number;
  };
};

export type Comment = {
  id: number;
  body: string;
  user_id?: number;
  user: User;
  createdAt: string;
  post_id: number;
  parent_id: number | null;
  _count?: {
    likes?: number;
  };
};

export type Post = {
  id: number;
  user_id: number;
  user: User;
  body: string;
  image?: string;
  createdAt: string;
  username?: string;
  comments: Comment[] | null;
  _count?: {
    comments?: number;
    likes?: number;
  };
};

export type Like = {
  id: number;
  user_id: number;
  post_id?: number;
  comment_id?: number;
};

export type AuthContextType = {
  onLogin: (email: string, password: string) => Promise<HttpError | null>;
  onLogout: () => void;
  user: User | null;
};

export type ToastContextType = {
  toasts: ToastProps[] | null;
  createToast: (message: string, type: ToastType, autoClose: boolean) => void;
  removeToast: (id: number) => void;
};

export type ToastType = "danger" | "info" | "success" | "warning";

export type ToastProps = {
  id: number;
  message: string;
  type: ToastType;
  autoClose?: boolean;
};

export type HttpError = {
  statusCode: number;
  name: string;
  message: string;
};

export type PostContextType = {
  post: Post | null;
  getReplies: (arg: number) => Comment[];
  getRootComments: Comment[];
  createNewComment: (comment: Comment) => void;
};

export type CommentGroup = {
  [key: string]: Comment[];
};

export type UserUpdateOptions = {
  id: number;
  bio?: string;
  avatar?: string;
};

export type LikeContextType = {
  likes: Like[];
  checkIfLiked: (id: number, type: "post" | "comment") => boolean;
  getLike: (id: number, type: "post" | "comment") => Like | undefined;
  setNewLike: (l: Like) => void;
  removeLike: (id: number) => void;
};

export type FeedContextType = {
  posts: Post[];
  addPost: (p: Post) => void;
  removePost: (id: number) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};
