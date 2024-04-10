-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiringAt" TIMESTAMP(3) NOT NULL,
    "warningAmount" TEXT NOT NULL,
    "firstWarning" TEXT,
    "firstWarningDate" TIMESTAMP(3),
    "secondWarning" TEXT,
    "secondWarningDate" TIMESTAMP(3),
    "thirdWarning" TEXT,
    "thirdWarningDate" TIMESTAMP(3),
    "userStatus" TEXT NOT NULL,
    "banReason" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SecretCodeAdmin" (
    "id" TEXT NOT NULL,
    "secretCode" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "CreationData" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpirationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SecretCodeAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
