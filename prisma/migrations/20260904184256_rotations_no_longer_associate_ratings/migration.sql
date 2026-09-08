/*
  Warnings:

  - You are about to drop the column `rotationId` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,albumId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_rotationId_fkey";

-- DropIndex
DROP INDEX "Rating_userId_albumId_rotationId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "rotationId",
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_albumId_key" ON "Rating"("userId", "albumId");
