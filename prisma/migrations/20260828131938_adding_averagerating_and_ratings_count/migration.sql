-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "AlbumArtist_artistId_idx" ON "AlbumArtist"("artistId");

-- CreateIndex
CREATE INDEX "Rating_albumId_idx" ON "Rating"("albumId");

-- CreateIndex
CREATE INDEX "TrackRating_trackId_idx" ON "TrackRating"("trackId");
