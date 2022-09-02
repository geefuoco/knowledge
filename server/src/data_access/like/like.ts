import type {
  LikeResult,
  LikeResultArray,
  LikeRepository,
  LikeCreateInfo
} from "./like_repository";
import { PrismaClient } from "@prisma/client";

export function createLikePrisma(prisma: PrismaClient): LikeRepository {
  async function findById(id: number): LikeResult {
    try {
      return await prisma.like.findFirst({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByUserId(userId: number): LikeResultArray {
    try {
      return await prisma.like.findMany({ where: { user_id: userId } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function create(likeInfo: LikeCreateInfo): LikeResult {
    try {
      return await prisma.like.create({ data: likeInfo });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteById(id: number): LikeResult {
    try {
      return await prisma.like.delete({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAllByUserId(
    userId: number
  ): Promise<{ count: number } | null> {
    try {
      return await prisma.like.deleteMany({ where: { user_id: userId } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAll(): Promise<{ count: number } | null> {
    try {
      return await prisma.like.deleteMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  return Object.freeze({
    findById,
    findByUserId,
    create,
    deleteById,
    deleteAllByUserId,
    deleteAll
  });
}
