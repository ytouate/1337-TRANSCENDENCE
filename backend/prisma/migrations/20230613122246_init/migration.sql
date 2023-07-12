-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
