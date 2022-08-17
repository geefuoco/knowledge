import type { Request, Response, NextFunction } from "express";
import type { PostRepository } from "../../data_access/post/post_repository";
import type { ExpressCallback } from "../helpers";
import { getIdOrThrow } from "../helpers";

export type PostController = {
  getPost: ExpressCallback;
  // getPostWithAllComments: ExpressCallback;
  // getAllPosts: ExpressCallback;
  // getAllPostsWithComments: ExpressCallback;
};

export default function createPostController(
  Post: PostRepository
): PostController {
  async function getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getIdOrThrow(req);
      let post = null;
      const { comments } = req.query;
      if (comments) {
        post = await Post.findByIdWithComments(id);
      } else {
        post = await Post.findById(id);
      }
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  return Object.freeze({
    getPost
  });
}
