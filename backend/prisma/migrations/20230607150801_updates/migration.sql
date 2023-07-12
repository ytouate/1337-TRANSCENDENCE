/*
  Warnings:

  - You are about to drop the `Blocking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blocking" DROP CONSTRAINT "Blocking_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "Blocking" DROP CONSTRAINT "Blocking_blockedbyId_fkey";

-- DropTable
DROP TABLE "Blocking";

-- CreateTable
CREATE TABLE "_blocking" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blocking_AB_unique" ON "_blocking"("A", "B");

-- CreateIndex
CREATE INDEX "_blocking_B_index" ON "_blocking"("B");

-- AddForeignKey
ALTER TABLE "_blocking" ADD CONSTRAINT "_blocking_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocking" ADD CONSTRAINT "_blocking_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
