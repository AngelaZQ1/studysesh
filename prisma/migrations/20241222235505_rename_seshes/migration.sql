/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_SessionParticipants" DROP CONSTRAINT "_SessionParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionParticipants" DROP CONSTRAINT "_SessionParticipants_B_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "_SessionParticipants";

-- CreateTable
CREATE TABLE "Sesh" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "virtual" BOOLEAN NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Sesh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SeshParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SeshParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SeshParticipants_B_index" ON "_SeshParticipants"("B");

-- AddForeignKey
ALTER TABLE "Sesh" ADD CONSTRAINT "Sesh_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeshParticipants" ADD CONSTRAINT "_SeshParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Sesh"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeshParticipants" ADD CONSTRAINT "_SeshParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
