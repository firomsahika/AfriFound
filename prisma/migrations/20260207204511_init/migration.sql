/*
  Warnings:

  - Added the required column `market` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "impact" TEXT,
ADD COLUMN     "market" TEXT NOT NULL,
ADD COLUMN     "traction" TEXT,
ALTER COLUMN "tagline" DROP NOT NULL;
