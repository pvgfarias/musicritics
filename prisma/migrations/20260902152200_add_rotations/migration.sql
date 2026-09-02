/*
  Warnings:

  - You are about to drop the column `finalized` on the `Album` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,albumId,rotationId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rotationId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Rating_userId_albumId_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "finalized";

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "rotationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Rotation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotationAlbum" (
    "id" TEXT NOT NULL,
    "rotationId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "RotationAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rotation_slug_key" ON "Rotation"("slug");

-- CreateIndex
CREATE INDEX "RotationAlbum_albumId_idx" ON "RotationAlbum"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "RotationAlbum_rotationId_albumId_key" ON "RotationAlbum"("rotationId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_albumId_rotationId_key" ON "Rating"("userId", "albumId", "rotationId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_rotationId_fkey" FOREIGN KEY ("rotationId") REFERENCES "Rotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotationAlbum" ADD CONSTRAINT "RotationAlbum_rotationId_fkey" FOREIGN KEY ("rotationId") REFERENCES "Rotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotationAlbum" ADD CONSTRAINT "RotationAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
