/*
  Warnings:

  - You are about to drop the column `roomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chatRoom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "chatRoom" DROP CONSTRAINT "chatRoom_userId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "chatRoom" DROP COLUMN "userId";
