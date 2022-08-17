import type {
  UserRepository,
  UserResult,
  UserResultArray,
  UserCreateInfo
} from "./user_repository";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export function createUserPrisma(prisma: PrismaClient): UserRepository {
  const SALT = 10;

  async function findById(id: number, password = false): UserResult {
    try {
      return await prisma.user.findFirst({
        where: { id },
        select: { id: true, email: true, bio: true, password: password }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findAll(): UserResultArray {
    try {
      return await prisma.user.findMany({
        select: { id: true, email: true, bio: true, password: false }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByIdWithPosts(id: number): UserResult {
    try {
      return await prisma.user.findFirst({
        where: {
          id
        },
        include: {
          posts: {
            include: {
              comments: true
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByEmail(email: string): UserResult {
    try {
      return await prisma.user.findFirst({
        where: { email },
        select: { email: true, id: true, password: false }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByDateBetween(start: Date, end: Date): UserResultArray {
    try {
      return await prisma.user.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: end
          }
        },
        select: {
          id: true,
          email: true,
          bio: true,
          password: false
        }
      });
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async function getUserLikes(id: number): UserResult {
    try {
      return await prisma.user.findFirst({
        where: {
          id
        },
        include: {
          likes: true
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function getUserPosts(id: number): UserResult {
    try {
      return await prisma.user.findFirst({
        where: {
          id
        },
        include: {
          posts: true
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function getUserComments(id: number): UserResult {
    try {
      return await prisma.user.findFirst({
        where: {
          id
        },
        include: {
          comments: true
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function create(userInfo: UserCreateInfo): UserResult {
    try {
      const salt = await bcrypt.genSalt(SALT);
      const hashedPassword = await bcrypt.hash(userInfo["password"], salt);
      return await prisma.user.create({
        data: { ...userInfo, password: hashedPassword }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteById(id: number): UserResult {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function deleteAll(): Promise<{ count: number } | null> {
    try {
      return await prisma.user.deleteMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  return Object.freeze({
    findById,
    findAll,
    findByEmail,
    findByDateBetween,
    findByIdWithPosts,
    getUserLikes,
    getUserPosts,
    getUserComments,
    create,
    deleteById,
    deleteAll
  });
}
