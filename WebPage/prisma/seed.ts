import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  const currentDate = new Date();
  await prisma.secretCode.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  const secretCode = generateRandomSecretCode(10);
  console.log(secretCode);
  const hashedSecretCode = await bcrypt.hash(secretCode, 10);

  await prisma.secretCode.create({
    data: {
      hash: hashedSecretCode,
      email: email,
      ExpirationDate: new Date(
        currentDate.setTime(currentDate.getTime() + 60 * 60 * 60 * 1000)
      ),
      Used: false
    }
  });
  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //   },
  // });

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
