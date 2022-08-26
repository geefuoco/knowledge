export type User = {
  id: number;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
};

export type Comment = {
  id: number;
  body: string;
  user_id?: number;
  user: User;
  createdAt: string;
  post_id: number;
  parent_id: number | null;
};

export type Post = {
  id: number;
  user_id: number;
  user: User;
  body: string;
  createdAt: string;
  comments: Comment[] | null;
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
