import { prisma } from "~/db.server";
import { inviteCodeLog } from "./adminLogs.server";

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
  contractNumber: string,
  roleSelection: string,
  time: string,
  selectedPercentage: string,
  admin: string,
) {
  const existingCode = await prisma.secretCodeAdmin.findFirst({
    where: {
      email: emailAdress,
      ExpirationDate: {
        gte: new Date(), // Only consider non-expired codes
      },
    },
  });

  if (existingCode) {
    // If code exists and is not expired, disallow creation
    if (existingCode.ExpirationDate > new Date()) {
      throw new Error("Code already exists and is not expired.");
    }
    // If code exists but is expired, proceed to create a new one
  }

  const secretCode = generateRandomSecretCode(10);
  let currentDate = new Date();
  let role = "";

  if (roleSelection === "holder") {
    return null;
  }

  if (customName === "" || emailAdress === "" || contractNumber === "") {
    return null;
  }
  if (time === "") {
    return null;
  }
  if (time === "thirtyMinutes") {
    currentDate = new Date(currentDate.getTime() + 30 * 60000);
    //currentDate = new Date(currentDate.getTime() + 1 * 10000);
  }
  if (time === "oneHour") {
    currentDate = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
  }
  if (time === "fifeHours") {
    currentDate = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  }
  if (time === "twelveHours") {
    currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
  }
  if (time === "twentyForHours") {
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }
  if (time === "oneWeek") {
    currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  if (time === "oneMonth") {
    currentDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  if (time === "threeMonths") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + 3);
  }
  if (time === "sixMonths") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + 6);
  }
  if (time === "nineMonths") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + 9);
  }
  if (time === "oneYear") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + 12);
  }
  if (time === "twoYears") {
    const currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth + 24);
  }

  if (roleSelection === "worker") {
    role = "Darbuotojas";
  }

  if (roleSelection === "client") {
    role = "Klientas";
  }

  if (selectedPercentage === "holder") {
    return null;
  }

  const nowdate = new Date();
  if (
    customName === "" ||
    emailAdress === "" ||
    contractNumber === "" ||
    roleSelection === "" ||
    time === "" ||
    time === "holder" ||
    roleSelection === "holder"
  ) {
    return null;
  } else {
    inviteCodeLog(emailAdress, admin);
    const createdCode = await prisma.secretCodeAdmin.create({
      data: {
        customName: customName,
        email: emailAdress,
        contractNumber: contractNumber,
        CreationData: nowdate,
        ExpirationDate: currentDate,
        Used: false,
        role: role,
        secretCode: secretCode,
        percentage: selectedPercentage,
      },
    });

    return createdCode; // Return the created code object
  }
}

export async function getAllcodes() {
  return prisma.secretCodeAdmin.findMany();
}

export async function markCodeAsUsed(findID: string) {
  // Check if the code exists
  const existingCode = await prisma.secretCodeAdmin.findUnique({
    where: {
      id: findID,
    },
  });

  // If the code doesn't exist, throw an error
  if (!existingCode) {
    throw new Error(`Code with ID ${findID} does not exist.`);
  }

  // Update the Used field to true
  const updatedCode = await prisma.secretCodeAdmin.update({
    where: {
      id: findID,
    },
    data: {
      Used: true,
    },
  });

  return updatedCode;
}

export async function changeCodeExpiring(emailtest: string, date: Date) {
  // Update the Used field to true

  const code = await prisma.secretCodeAdmin.findFirst({
    where: {
      email: emailtest,
    },
  });

  // If a code is found, update its ExpirationDate
  if (code) {
    const updatedCode = await prisma.secretCodeAdmin.update({
      where: {
        id: code.id, // Use the code's id to uniquely identify it
      },
      data: {
        ExpirationDate: date,
      },
    });

    return updatedCode;
  } else {
    throw new Error(`Code with email ${emailtest} not found.`);
  }
}

export async function changeCodePercentage(
  emailID: string,
  percentageChange: string,
) {
  const code = await prisma.secretCodeAdmin.findFirst({
    where: {
      email: emailID,
    },
  });

  if (code) {
    const updatedCode = await prisma.secretCodeAdmin.update({
      where: {
        id: code.id, // Use the code's id to uniquely identify it
      },
      data: {
        percentage: percentageChange,
      },
    });

    return updatedCode;
  } else {
    throw new Error(`Code with email ${emailID} not found.`);
  }
}
