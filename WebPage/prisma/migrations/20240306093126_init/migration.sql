/*
  Warnings:

  - Added the required column `role` to the `SecretCodeAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretCode` to the `SecretCodeAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SecretCodeAdmin" ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "secretCode" TEXT NOT NULL;
