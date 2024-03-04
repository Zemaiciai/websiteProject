/*
  Warnings:

  - You are about to drop the column `userEmail` on the `SecretCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `SecretCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `SecretCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SecretCode_userEmail_key";

-- AlterTable
ALTER TABLE "SecretCode" DROP COLUMN "userEmail",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SecretCode_email_key" ON "SecretCode"("email");
