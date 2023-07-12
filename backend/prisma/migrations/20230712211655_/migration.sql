-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('FINISHED', 'OUTGOING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loss" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "win" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Preference" (
    "id" SERIAL NOT NULL,
    "ballColor" TEXT NOT NULL DEFAULT 'black',
    "paddleColor" TEXT NOT NULL DEFAULT 'black',
    "mapTheme" TEXT NOT NULL DEFAULT 'galaxy_pink',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'OUTGOING',
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "winnerId" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "playerOrder" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_GameUsers_AB_unique" ON "_GameUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_GameUsers_B_index" ON "_GameUsers"("B");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameUsers" ADD CONSTRAINT "_GameUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameUsers" ADD CONSTRAINT "_GameUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
