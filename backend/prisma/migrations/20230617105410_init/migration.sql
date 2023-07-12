-- AlterTable
ALTER TABLE "chatRoom" ADD COLUMN     "admins" TEXT[],
ADD COLUMN     "banUsers" TEXT[],
ADD COLUMN     "muteUsers" TEXT[];
