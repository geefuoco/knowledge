import type {
  CommentCreateInfo,
  CommentResult,
  CommentResultArray,
  CommentRepository
} from "./comment_repository";
import { PrismaClient } from "@prisma/client";

export function createCommentPrisma(prisma: PrismaClient): CommentRepository {
  async function findById(id: number): CommentResult {
    try {
      return await prisma.comment.findFirst({
        where: {
          id
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByUserId(userId: number): CommentResultArray {
    try {
      return await prisma.comment.findMany({
        where: { user_id: userId }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByParentId(parentId: number): CommentResult {
    try {
      return await prisma.comment.findFirst({
        where: { parent_id: parentId }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByPostId(postId: number): CommentResultArray {
    try {
      return await prisma.comment.findMany({
        where: {
          post_id: postId
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findBetweenDate(start: Date, end: Date): CommentResultArray {
    try {
      return await prisma.comment.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: end
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function create(commentInfo: CommentCreateInfo): CommentResult {
    try {
      return await prisma.comment.create({ data: commentInfo });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteById(id: number): CommentResult {
    try {
      return await prisma.comment.delete({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAll(): Promise<{ count: number } | null> {
    try {
      return await prisma.comment.deleteMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAllByUserId(
    userId: number
  ): Promise<{ count: number } | null> {
    try {
      return await prisma.comment.deleteMany({
        where: { user_id: userId }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  return Object.freeze({
    findById,
    findByUserId,
    findByParentId,
    findByPostId,
    findBetweenDate,
    create,
    deleteById,
    deleteAll,
    deleteAllByUserId
  });
}
