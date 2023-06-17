-- CreateTable
CREATE TABLE "Preference" (
    "id" SERIAL NOT NULL,
    "ballColor" TEXT NOT NULL DEFAULT 'black',
    "paddleColor" TEXT NOT NULL DEFAULT 'black',
    "mapTheme" TEXT NOT NULL DEFAULT 'default',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
