import type { Request, Response } from "express";
import type { PostRepository } from "../../data_access/post/post_repository";
import {
  ExpressCallback,
  parseIdOrThrow,
  expressWrapper,
  createTimestamp
} from "../helpers";

import apiErrors, { StatusCodes } from "../../errors/api_errors";

export type PostController = {
  getPost: ExpressCallback;
  getPostWithComments: ExpressCallback;
  createPost: ExpressCallback;
};

export default function createPostController(
  Post: PostRepository
): PostController {
  async function getPost(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const post = await Post.findById(id);
    if (!post) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(post);
  }

  async function getPostWithComments(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const post = await Post.findByIdWithComments(id);
    if (!post) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(post);
  }

  async function createPost(req: Request, res: Response) {
    const { body, user_id } = req.body;
    if (!body || !user_id) {
      throw apiErrors.createInvalidRequestError();
    }
    if (body.length > 250) {
      throw apiErrors.createInvalidContentLengthError();
    }
    const createdAt = createTimestamp();
    const post = await Post.create({
      body,
      user_id,
      createdAt
    });
    res.status(StatusCodes.CREATED).json(post);
  }

  return Object.freeze({
    getPost: expressWrapper(getPost),
    getPostWithComments: expressWrapper(getPostWithComments),
    createPost: expressWrapper(createPost)
  });
}
