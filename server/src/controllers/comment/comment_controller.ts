import type { Request, Response } from "express";
import type { CommentRepository } from "../../data_access/comment/comment_repository";
import apiErrors, { StatusCodes } from "../../errors/api_errors";
import {
  ExpressCallback,
  parseIdOrThrow,
  expressWrapper,
  createTimestamp
} from "../helpers";

export type CommentController = {
  getComment: ExpressCallback;
  createComment: ExpressCallback;
  deleteComment: ExpressCallback;
};

export default function createCommentController(
  Comment: CommentRepository
): CommentController {
  async function getComment(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const comment = await Comment.findById(id);
    if (!comment) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(comment);
  }

  async function createComment(req: Request, res: Response) {
    const { body, user_id, post_id, parent_id } = req.body;
    if (!body || !user_id || !post_id) {
      throw apiErrors.createInvalidRequestError();
    }
    if (body.length > 250) {
      throw apiErrors.createInvalidContentLengthError();
    }
    const createdAt = createTimestamp();
    const comment = await Comment.create({
      body,
      user_id,
      post_id,
      parent_id: parent_id ?? null,
      createdAt
    });
    if (!comment) {
      throw apiErrors.createBadInputError();
    }
    res.status(StatusCodes.CREATED).json(comment);
  }

  async function deleteComment(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const comment = Comment.deleteById(id);
    if (!comment) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(comment);
  }

  return Object.freeze({
    getComment: expressWrapper(getComment),
    createComment: expressWrapper(createComment),
    deleteComment: expressWrapper(deleteComment)
  });
}
