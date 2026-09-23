-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastCompletedRotationId" TEXT,
ADD COLUMN     "longestRotationStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rotationStreak" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_lastCompletedRotationId_fkey" FOREIGN KEY ("lastCompletedRotationId") REFERENCES "Rotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
