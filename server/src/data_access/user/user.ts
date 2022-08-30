import type {
  UserRepository,
  UserResult,
  UserResultArray,
  UserCreateInfo
} from "./user_repository";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ProfanityFilter } from "../../config/config";

export function createUserPrisma(
  prisma: PrismaClient,
  profanityFilter: ProfanityFilter
): UserRepository {
  const SALT = 10;

  async function findById(id: number, password = false): UserResult {
    try {
      return await prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          password: password
        }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findAll(): UserResultArray {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          password: false
        }
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
        select: {
          username: true,
          bio: true,
          avatar: true,
          posts: {
            orderBy: {
              createdAt: "desc"
            },
            include: {
              _count: {
                select: {
                  comments: true
                }
              }
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
        select: { username: true, email: true, id: true, password: false }
      });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByUsername(username: string): UserResultArray {
    try {
      return await prisma.user.findMany({
        where: {
          username: {
            contains: username,
            mode: "insensitive"
          }
        },
        select: {
          id: true,
          username: true,
          _count: {
            select: {
              posts: true,
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
          username: true,
          email: true,
          bio: true,
          password: false
        }
      });
    } catch (error) {
      console.error(error);
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
      const hasProfanityInEmail = profanityFilter(userInfo.email);
      const hasProfanityInBio = profanityFilter(userInfo.bio ?? "");
      const hasProfanityInUsername = profanityFilter(userInfo.username);
      if (hasProfanityInEmail || hasProfanityInBio || hasProfanityInUsername) {
        return null;
      }
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

  async function login(email: string, password: string): UserResult {
    try {
      const user = await prisma.user.findFirst({
        where: { email }
      });
      if (!user) {
        return null;
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }
      user.password = "";
      return user;
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
    findByUsername,
    findByDateBetween,
    findByIdWithPosts,
    getUserLikes,
    getUserPosts,
    getUserComments,
    create,
    deleteById,
    deleteAll,
    login
  });
}
