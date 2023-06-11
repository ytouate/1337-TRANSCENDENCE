/*
  Warnings:

  - You are about to drop the column `player1Id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `games` table. All the data in the column will be lost.
  - Added the required column `playerOrder` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_player2Id_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
ADD COLUMN     "playerOrder" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_GameUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameUsers_AB_unique" ON "_GameUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_GameUsers_B_index" ON "_GameUsers"("B");

-- AddForeignKey
ALTER TABLE "_GameUsers" ADD CONSTRAINT "_GameUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameUsers" ADD CONSTRAINT "_GameUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
