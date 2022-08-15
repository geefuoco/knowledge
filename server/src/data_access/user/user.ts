import type {
  UserRepository,
  UserResult,
  UserResultArray,
  UserCreateInfo
} from "./user_repository";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export function createUserPrisma(): UserRepository {
  const prisma = new PrismaClient();
  const SALT = 10;

  async function findById(id: number): UserResult {
    try {
      return await prisma.user.findFirst({ where: { id } });
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findAll(): UserResultArray {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async function findByEmail(email: string): UserResult {
    try {
      return await prisma.user.findFirst({ where: { email } });
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
        }
      });
    } catch (error) {
      console.log(error);
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

  return Object.freeze({
    findById,
    findAll,
    findByEmail,
    findByDateBetween,
    create,
    deleteById
  });
}
