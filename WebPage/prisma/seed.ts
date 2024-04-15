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
  let currentDate = new Date();
  let expirationDate = new Date();
  currentDate = new Date(currentDate.getTime());
  expirationDate = new Date(
    currentDate.getTime() + 100000 * 24 * 60 * 60 * 1000
  );
  const secretCode = generateRandomSecretCode(10);
  console.log(secretCode);

  await prisma.secretCodeAdmin.create({
    data: {
      customName: "Super Admin",
      email: email,
      contractNumber: "Super Admin",
      CreationData: currentDate,
      ExpirationDate: expirationDate,
      Used: false,
      role: "Super Admin",
      secretCode: secretCode
    }
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
