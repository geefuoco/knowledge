import type {
  PostCreateInfo,
  PostRepository,
  PostResult,
  PostResultArray
} from "./post_repository";
import { PrismaClient } from "@prisma/client";

export function createPostPrisma(prisma: PrismaClient): PostRepository {
  async function findById(id: number): PostResult {
    try {
      return await prisma.post.findFirst({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByUserId(userId: number): PostResultArray {
    try {
      return await prisma.post.findMany({ where: { user_id: userId } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findAll(): PostResultArray {
    try {
      return await prisma.post.findMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findBetweenDate(start: Date, end: Date): PostResultArray {
    try {
      return await prisma.post.findMany({
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

  async function create(postInfo: PostCreateInfo): PostResult {
    try {
      return await prisma.post.create({ data: postInfo });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteById(id: number): PostResult {
    try {
      return await prisma.post.delete({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAllByUserId(
    userId: number
  ): Promise<{ count: number } | null> {
    try {
      return await prisma.post.deleteMany({ where: { user_id: userId } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAll(): Promise<{ count: number } | null> {
    try {
      return await prisma.post.deleteMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  return Object.freeze({
    findById,
    findAll,
    findByUserId,
    findBetweenDate,
    create,
    deleteById,
    deleteAllByUserId,
    deleteAll
  });
}