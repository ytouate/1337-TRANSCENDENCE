/*
  Warnings:

  - You are about to drop the column `lobbyId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Lobby` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_lobbyId_fkey";

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "score1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score2" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "lobbyId";

-- DropTable
DROP TABLE "Lobby";
