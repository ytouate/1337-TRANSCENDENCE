-- CreateTable
CREATE TABLE "Blocking" (
    "id" SERIAL NOT NULL,
    "blockedbyId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "Blocking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_blockedbyId_fkey" FOREIGN KEY ("blockedbyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
