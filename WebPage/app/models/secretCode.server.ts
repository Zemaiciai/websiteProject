import { prisma } from "~/db.server";

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

export async function createCode(
  customName: string,
  emailAdress: string,
  contractNumber: string
) {
  const secretCode = generateRandomSecretCode(10);
  const currentDate = new Date();
  return prisma.secretCodeAdmin.create({
    data: {
      customName: customName,
      email: emailAdress,
      contractNumber: contractNumber,
      ExpirationDate: new Date(currentDate.getTime() + 60 * 60 * 60 * 1000),
      Used: false,
      role: "worker",
      secretCode: secretCode
    }
  });
}

export async function getAllcodes() {
  const allCodes = await prisma.secretCodeAdmin.findMany();
  return allCodes;
}
