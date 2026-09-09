/*
  Warnings:

  - You are about to drop the `AlbumSocialLink` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Rotation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StreamingPlatform" AS ENUM ('SPOTIFY', 'APPLE_MUSIC', 'DEEZER', 'TIDAL', 'YOUTUBE_MUSIC', 'SOUNDCLOUD', 'BANDCAMP', 'AMAZON_MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('LP', 'EP', 'SINGLE', 'COMPILATION', 'LIVE', 'MIXTAPE', 'SOUNDTRACK');

-- CreateEnum
CREATE TYPE "ArtistRole" AS ENUM ('PRIMARY', 'FEATURED', 'PRODUCER');

-- DropForeignKey
ALTER TABLE "AlbumSocialLink" DROP CONSTRAINT "AlbumSocialLink_albumId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "labelId" TEXT,
ADD COLUMN     "releaseType" "ReleaseType" NOT NULL DEFAULT 'LP',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AlbumArtist" ADD COLUMN     "role" "ArtistRole" NOT NULL DEFAULT 'PRIMARY';

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "disbandedDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rotation" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "country" TEXT;

-- DropTable
DROP TABLE "AlbumSocialLink";

-- CreateTable
CREATE TABLE "UserFavoriteAlbum" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavoriteArtist" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingLink" (
    "id" TEXT NOT NULL,
    "platform" "StreamingPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "albumId" TEXT,
    "artistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamingLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserFavoriteAlbum_albumId_idx" ON "UserFavoriteAlbum"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteAlbum_userId_albumId_key" ON "UserFavoriteAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteAlbum_userId_position_key" ON "UserFavoriteAlbum"("userId", "position");

-- CreateIndex
CREATE INDEX "UserFavoriteArtist_artistId_idx" ON "UserFavoriteArtist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteArtist_userId_artistId_key" ON "UserFavoriteArtist"("userId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteArtist_userId_position_key" ON "UserFavoriteArtist"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Label_slug_key" ON "Label"("slug");

-- CreateIndex
CREATE INDEX "StreamingLink_albumId_idx" ON "StreamingLink"("albumId");

-- CreateIndex
CREATE INDEX "StreamingLink_artistId_idx" ON "StreamingLink"("artistId");

-- CreateIndex
CREATE INDEX "Album_labelId_idx" ON "Album"("labelId");

-- AddForeignKey
ALTER TABLE "UserFavoriteAlbum" ADD CONSTRAINT "UserFavoriteAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteAlbum" ADD CONSTRAINT "UserFavoriteAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteArtist" ADD CONSTRAINT "UserFavoriteArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteArtist" ADD CONSTRAINT "UserFavoriteArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamingLink" ADD CONSTRAINT "StreamingLink_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamingLink" ADD CONSTRAINT "StreamingLink_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
