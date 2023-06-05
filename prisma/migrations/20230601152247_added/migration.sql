-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lobbyId" INTEGER;

-- CreateTable
CREATE TABLE "Lobby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_name_key" ON "Lobby"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;
