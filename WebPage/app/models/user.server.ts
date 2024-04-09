import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import {
  changeCodeExpiring,
  changeCodePercentage,
  markCodeAsUsed
} from "./secretCode.server";

export type { User } from "@prisma/client";

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: User["email"],
  password: string,
  firstName: string,
  lastName: string,
  userName: string,
  secretCode: string
) {
  const userSecretCode = await prisma.secretCodeAdmin.findFirst({
    where: {
      email,
      ExpirationDate: {
        gte: new Date()
      }
    }
  });

  if (!userSecretCode) {
    return null;
  }

  const secretCodeIsValid = secretCode === userSecretCode.secretCode;

  if (!secretCodeIsValid) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  markCodeAsUsed(userSecretCode.id);

  return prisma.user.create({
    data: {
      email,
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      expiringAt: userSecretCode.ExpirationDate,
      role: userSecretCode.role,
      percentage: userSecretCode.percentage,
      warningAmount: "0",
      userStatus: "Aktyvi",
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!passwordIsValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getAllusers() {
  return prisma.user.findMany();
}

export async function baningUser(findEMAIL: string, reason: string) {
  const banUser = await prisma.user.update({
    where: {
      email: findEMAIL
    },
    data: {
      banReason: reason,
      userStatus: "Užblokuota"
    }
  });

  return banUser;
}

export async function unBaningUser(findEMAIL: string) {
  const banUser = await prisma.user.update({
    where: {
      email: findEMAIL
    },
    data: {
      banReason: null,
      userStatus: "Aktyvi"
    }
  });

  return banUser;
}

export async function warningUser(findEMAIL: string, reason: string) {
  let user = await prisma.user.findUnique({
    where: {
      email: findEMAIL
    }
  });

  if (user?.warningAmount === "0") {
    user = await prisma.user.update({
      where: {
        email: findEMAIL
      },
      data: {
        warningAmount: "1",
        firstWarning: reason,
        firstWarningDate: new Date()
      }
    });
  } else if (user?.warningAmount === "1") {
    user = await prisma.user.update({
      where: {
        email: findEMAIL
      },
      data: {
        warningAmount: "2",
        secondWarning: reason,
        secondWarningDate: new Date()
      }
    });
  } else {
    user = await prisma.user.update({
      where: {
        email: findEMAIL
      },
      data: {
        warningAmount: "3",
        thirdWarning: reason,
        thirdWarningDate: new Date(),
        userStatus: "Užlokuota",
        banReason: "Surinkti 3 įspėjimai"
      }
    });
    //IF YOU WANT TO REMOVE WARNINGS
    // } else {
    //   user = await prisma.user.update({
    //     where: {
    //       email: findEMAIL
    //     },
    //     data: {
    //       warningAmount: "0",
    //       thirdWarning: null,
    //       thirdWarningDate: null,
    //       secondWarning: null,
    //       secondWarningDate: null,
    //       firstWarning: null,
    //       firstWarningDate: null,
    //       userStatus: "Aktyvi",
    //       banReason: null
    //     }
    //   });
  }

  return user;
}

export async function changeUserInformation(
  findEMAIL: string,
  firstNameChange: string,
  lastNameChange: string,
  nickNameChange: string,
  emailChange: string,
  roleChange: string,
  timeChange: string,
  percentageChange: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email: findEMAIL
    }
  });

  let currentDate: Date | null = user?.expiringAt ?? null;

  if (currentDate !== null && timeChange !== "holder") {
    if (timeChange === "oneMonth") {
      currentDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (timeChange === "threeMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 3);
    } else if (timeChange === "sixMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 6);
    } else if (timeChange === "nineMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 9);
    } else if (timeChange === "oneYear") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 12);
    } else if (timeChange === "twoYears") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 24);
    }

    const changeInfo = await prisma.user.update({
      where: {
        email: findEMAIL
      },
      data: {
        firstName: firstNameChange,
        lastName: lastNameChange,
        userName: nickNameChange,
        role: roleChange,
        email: emailChange,
        percentage: percentageChange,
        expiringAt: currentDate !== null ? currentDate : undefined
      }
    });
    changeCodeExpiring(findEMAIL, currentDate);

    if (percentageChange !== "") {
      changeCodePercentage(findEMAIL, percentageChange);
    }

    return changeInfo;
  } else {
    const changeInfo = await prisma.user.update({
      where: {
        email: findEMAIL
      },
      data: {
        firstName: firstNameChange,
        lastName: lastNameChange,
        userName: nickNameChange,
        role: roleChange,
        email: emailChange,
        percentage: percentageChange
      }
    });
    if (percentageChange !== "") {
      changeCodePercentage(findEMAIL, percentageChange);
    }
    return changeInfo;
  }
}
