import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateRandomSecretCode = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

async function seed() {
  const email = "test@gmail.com";
  const email2 = "darbuotojas@gmail.com";
  const email3 = "klientas@gmail.com";
  let currentDate = new Date();
  let expirationDate = new Date();
  currentDate = new Date(currentDate.getTime());
  expirationDate = new Date(
    currentDate.getTime() + 100000 * 24 * 60 * 60 * 1000,
  );
  const secretCode = generateRandomSecretCode(10);
  const secretCode2 = generateRandomSecretCode(10);
  const secretCode3 = generateRandomSecretCode(10);
  console.log("--------------------------------------------------------");
  console.log("[ROLĖ]         [EL.PAŠTAS]                   [Kodas]");
  console.log("--------------------------------------------------------");
  console.log("[SUPER ADMIN]  test@gmail.com kodas -        " + secretCode);
  console.log("[DARBUOTOJAS]  darbuotojas@gmail.com kodas - " + secretCode2);
  console.log("[KLIENTAS]     klientas@gmail.com kodas -    " + secretCode3);
  console.log("--------------------------------------------------------");

  await prisma.secretCodeAdmin.create({
    data: {
      customName: "Super Admin",
      email: email,
      contractNumber: "Super Admin",
      CreationData: currentDate,
      ExpirationDate: expirationDate,
      Used: false,
      role: "Super Admin",
      secretCode: secretCode,
    },
  });

  await prisma.secretCodeAdmin.create({
    data: {
      customName: "Darbuotojas",
      email: email2,
      contractNumber: "Darbuotojas",
      CreationData: currentDate,
      ExpirationDate: expirationDate,
      Used: false,
      role: "Darbuotojas",
      secretCode: secretCode2,
      percentage: "1%",
    },
  });

  await prisma.secretCodeAdmin.create({
    data: {
      customName: "Klientas",
      email: email3,
      contractNumber: "Klientas",
      CreationData: currentDate,
      ExpirationDate: expirationDate,
      Used: false,
      role: "Klientas",
      secretCode: secretCode3,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
