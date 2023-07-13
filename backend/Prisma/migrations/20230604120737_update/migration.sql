/*
  Warnings:

  - You are about to drop the column `readOrNot` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `sender` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "readOrNot",
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
