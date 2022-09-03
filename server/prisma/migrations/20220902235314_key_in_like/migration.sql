/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Like_key_key" ON "Like"("key");
