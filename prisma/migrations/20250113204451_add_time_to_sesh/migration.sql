/*
  Warnings:

  - Added the required column `time` to the `Sesh` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sesh" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
