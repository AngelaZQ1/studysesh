/*
  Warnings:

  - You are about to drop the column `date` on the `Sesh` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Sesh` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sesh" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3);
