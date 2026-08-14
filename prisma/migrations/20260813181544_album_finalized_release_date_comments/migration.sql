/*
  Warnings:

  - You are about to drop the column `releaseYear` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `finalized` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trackRatingId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "releaseYear",
ADD COLUMN     "finalized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "releaseDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "trackRatingId" TEXT,
ALTER COLUMN "ratingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "finalized",
ADD COLUMN     "ratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TrackRating" ADD COLUMN     "ratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_trackRatingId_key" ON "Comment"("trackRatingId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_trackRatingId_fkey" FOREIGN KEY ("trackRatingId") REFERENCES "TrackRating"("id") ON DELETE CASCADE ON UPDATE CASCADE;
