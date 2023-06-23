-- AlterTable
ALTER TABLE "chatRoom" ADD COLUMN     "password" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'public';
