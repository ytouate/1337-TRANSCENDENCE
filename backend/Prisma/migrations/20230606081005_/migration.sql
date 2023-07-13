/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receiverId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "receiverId",
DROP COLUMN "sender";

-- CreateTable
CREATE TABLE "_userNotificaiton" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userNotificaiton_AB_unique" ON "_userNotificaiton"("A", "B");

-- CreateIndex
CREATE INDEX "_userNotificaiton_B_index" ON "_userNotificaiton"("B");

-- AddForeignKey
ALTER TABLE "_userNotificaiton" ADD CONSTRAINT "_userNotificaiton_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userNotificaiton" ADD CONSTRAINT "_userNotificaiton_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
