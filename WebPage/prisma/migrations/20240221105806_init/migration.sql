-- CreateTable
CREATE TABLE "SecretCode" (
    "hash" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "ExpirationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Used" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretCode_userEmail_key" ON "SecretCode"("userEmail");
