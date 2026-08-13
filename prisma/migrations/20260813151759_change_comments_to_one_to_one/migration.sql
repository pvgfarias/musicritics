/*
  Warnings:

  - A unique constraint covering the columns `[ratingId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_ratingId_key" ON "Comment"("ratingId");
