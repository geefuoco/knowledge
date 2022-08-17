import type { Request, Response, NextFunction } from "express";
import type { PostRepository } from "../../data_access/post/post_repository";
import type { ExpressCallback } from "../helpers";
import { getIdOrThrow } from "../helpers";

export type PostController = {
  getPost: ExpressCallback;
  getPostWithComments: ExpressCallback;
  create: ExpressCallback;
};

export default function createPostController(
  Post: PostRepository
): PostController {
  async function getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getIdOrThrow(req);
      const post = await Post.findById(id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async function getPostWithComments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = getIdOrThrow(req);
      const post = await Post.findByIdWithComments(id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user_id } = req.body;
      if (!body || !user_id) {
        throw new Error("Invalid parameters. Body and user_id required");
      }
      if (body.length > 250) {
        throw new Error("Body must be less then 250 characters");
      }
      const createdAt = new Date(Date.now());
      const post = await Post.create({
        body,
        user_id,
        createdAt
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  return Object.freeze({
    getPost,
    getPostWithComments,
    create
  });
}
