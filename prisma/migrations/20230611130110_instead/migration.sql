/*
  Warnings:

  - You are about to drop the `_GameUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `player1Id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GameUsers" DROP CONSTRAINT "_GameUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameUsers" DROP CONSTRAINT "_GameUsers_B_fkey";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "player1Id" INTEGER NOT NULL,
ADD COLUMN     "player2Id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_GameUsers";

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
