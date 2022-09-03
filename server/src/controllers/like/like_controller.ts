import type { Request, Response } from "express";
import type { LikeRepository } from "../../data_access/like/like_repository";
import apiErrors, { StatusCodes } from "../../errors/api_errors";
import { ExpressCallback, parseIdOrThrow, expressWrapper } from "../helpers";

export type LikeController = {
  getLike: ExpressCallback;
  createLike: ExpressCallback;
  deleteLike: ExpressCallback;
};

export default function createLikeController(
  Like: LikeRepository
): LikeController {
  async function getLike(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const like = await Like.findById(id);
    if (!like) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(like);
  }

  async function createLike(req: Request, res: Response) {
    const { user_id, post_id, comment_id } = req.body;
    if (!user_id || (!post_id && !comment_id) || (post_id && comment_id)) {
      throw apiErrors.createBadInputError();
    }
    const keyStart = post_id ? "post" : "comment";
    const keyMiddle = post_id || comment_id;
    const key = `${keyStart}_${keyMiddle}_${user_id}`;

    const oldLike = await Like.findByKey(key);
    console.log(oldLike);
    if (oldLike) {
      res.status(StatusCodes.CREATED).end();
      return;
    }

    const like = await Like.create({
      key,
      user_id,
      post_id: post_id ?? null,
      comment_id: comment_id ?? null
    });

    if (!like) {
      throw apiErrors.createBadInputError();
    }
    res.status(StatusCodes.CREATED).json(like);
  }

  async function deleteLike(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const like = await Like.deleteById(id);
    if (!like) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(like);
  }

  return Object.freeze({
    getLike: expressWrapper(getLike),
    createLike: expressWrapper(createLike),
    deleteLike: expressWrapper(deleteLike)
  });
}
