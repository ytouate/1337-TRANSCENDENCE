/*
  Warnings:

  - You are about to drop the column `socketId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "socketId",
ALTER COLUMN "activitystatus" SET DEFAULT false;
