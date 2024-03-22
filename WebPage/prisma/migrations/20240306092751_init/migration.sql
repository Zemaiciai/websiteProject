-- CreateTable
CREATE TABLE "SecretCodeAdmin" (
    "customName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "ExpirationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Used" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretCodeAdmin_email_key" ON "SecretCodeAdmin"("email");
