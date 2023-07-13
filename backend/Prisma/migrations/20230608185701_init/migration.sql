/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "chatRoom" DROP CONSTRAINT "chatRoom_userId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_userInChatRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userInChatRoom_AB_unique" ON "_userInChatRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_userInChatRoom_B_index" ON "_userInChatRoom"("B");

-- AddForeignKey
ALTER TABLE "_userInChatRoom" ADD CONSTRAINT "_userInChatRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userInChatRoom" ADD CONSTRAINT "_userInChatRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "chatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
