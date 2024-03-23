/*
  Warnings:

  - Added the required column `expiringAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiringAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
