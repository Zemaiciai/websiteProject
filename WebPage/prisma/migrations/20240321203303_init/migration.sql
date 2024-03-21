/*
  Warnings:

  - Added the required column `firstWarning` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstWarningDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondWarning` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondWarningDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdWarning` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdWarningDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warningAmount` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstWarning" TEXT NOT NULL,
ADD COLUMN     "firstWarningDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "secondWarning" TEXT NOT NULL,
ADD COLUMN     "secondWarningDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "thirdWarning" TEXT NOT NULL,
ADD COLUMN     "thirdWarningDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "warningAmount" TEXT NOT NULL;
