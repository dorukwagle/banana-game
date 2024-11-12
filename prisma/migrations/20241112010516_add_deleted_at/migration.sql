/*
  Warnings:

  - Added the required column `deletedAt` to the `GameProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameProgress" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GameRecords" ADD COLUMN     "deletedAt" TIMESTAMP(3);
