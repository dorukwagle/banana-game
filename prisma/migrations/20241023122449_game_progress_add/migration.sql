-- AlterTable
ALTER TABLE "GameProgress" ADD COLUMN     "gamesCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "highestStreak" SET DEFAULT 0,
ALTER COLUMN "userStrength" SET DEFAULT 0;
