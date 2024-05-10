import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import {
  createBanLog,
  createInfoChangeLog,
  createUnBanLog,
  createWarningLog,
} from "./adminLogs.server";
import {
  changeCodeEmail,
  changeCodePercentage,
  markCodeAsUsed,
} from "./secretCode.server";

export type { User } from "@prisma/client";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
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
  secretCode: string,
) {
  const userSecretCode = await prisma.secretCodeAdmin.findFirst({
    where: {
      email,
      ExpirationDate: {
        gte: new Date(),
      },
    },
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
  const checkIfUserNameExists = await prisma.user.findFirst({
    where: { userName: userName },
  });
  if (checkIfUserNameExists) {
    return null;
  }
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
      balance: 0,
      rating: 0,
      ratingAmount: 0,
      userStatus: "Aktyvi",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}
export async function checkIfUserNameExists(userName: string) {
  const checkIfUserNameExists = await prisma.user.findFirst({
    where: { userName: userName },
  });
  if (checkIfUserNameExists) {
    return true;
  }
  return false;
}
export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
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

export async function baningUser(
  findEMAIL: string,
  reason: string,
  admin: string,
) {
  const banUser = await prisma.user.update({
    where: {
      email: findEMAIL,
    },
    data: {
      banReason: reason,
      userStatus: "Užblokuota",
    },
  });

  createBanLog(banUser.email, reason, admin);

  return banUser;
}

export async function unBaningUser(findEMAIL: string, admin: string) {
  const banUser = await prisma.user.update({
    where: {
      email: findEMAIL,
    },
    data: {
      banReason: null,
      userStatus: "Aktyvi",
    },
  });
  createUnBanLog(banUser.email, admin);
  return banUser;
}

export async function warningUser(
  findEMAIL: string,
  reason: string,
  admin: string,
) {
  let user = await prisma.user.findUnique({
    where: {
      email: findEMAIL,
    },
  });

  if (user?.warningAmount === "0") {
    user = await prisma.user.update({
      where: {
        email: findEMAIL,
      },
      data: {
        warningAmount: "1",
        firstWarning: reason,
        firstWarningDate: new Date(),
      },
    });
    createWarningLog(user.email, reason, admin);
  } else if (user?.warningAmount === "1") {
    user = await prisma.user.update({
      where: {
        email: findEMAIL,
      },
      data: {
        warningAmount: "2",
        secondWarning: reason,
        secondWarningDate: new Date(),
      },
    });
    createWarningLog(user.email, reason, admin);
  } else {
    user = await prisma.user.update({
      where: {
        email: findEMAIL,
      },
      data: {
        warningAmount: "3",
        thirdWarning: reason,
        thirdWarningDate: new Date(),
        userStatus: "Užlokuota",
        banReason: "Surinkti 3 įspėjimai",
      },
    });
    createWarningLog(user.email, reason, admin);

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
  percentageChange: string,
  admin: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      email: findEMAIL,
    },
  });
  let check = false;
  //Checking if we need to change the first name
  if (
    user?.firstName !== firstNameChange &&
    firstNameChange !== "" &&
    user?.firstName
  ) {
    check = true;
    await changeFirstName(user.id, firstNameChange, admin, user.firstName);
  }
  //Checking if we need to change the last name
  if (
    user?.lastName !== lastNameChange &&
    lastNameChange !== "" &&
    user?.lastName
  ) {
    check = true;
    await changeLastName(user.id, lastNameChange, admin, user.lastName);
  }
  //Checking if we need to change the username
  if (
    user?.userName !== nickNameChange &&
    nickNameChange !== "" &&
    user?.userName
  ) {
    check = true;
    await changeUserName(user.id, nickNameChange, admin, user.userName);
  }

  //Checking if we need to change the percentage
  if (
    user?.percentage !== percentageChange &&
    percentageChange !== "" &&
    user?.role === "Darbuotojas"
  ) {
    if (user?.percentage) {
      check = true;
      console.log(percentageChange);
      console.log(user.percentage);
      await changePercentage(user.id, percentageChange, admin, user.percentage);
      await changeCodePercentage(user.id, percentageChange);
    } else if (user?.id) {
      check = true;
      console.log(percentageChange);
      console.log(user.percentage);
      await changePercentage(user.id, percentageChange, admin, "neegzistavo");
      await changeCodePercentage(user.id, percentageChange);
    }
  }

  //Checking if we need to change the role
  if (user?.role !== roleChange && roleChange !== "" && user?.role) {
    check = true;
    await changeRole(user.id, roleChange, admin, user.role);
  }

  //Checking if we need to change the expiration date
  let currentDate: Date | null = user?.expiringAt ?? null;

  if (currentDate !== null && timeChange !== "holder" && user?.id) {
    if (timeChange === "oneMonth") {
      check = true;
      currentDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(
        user.email,
        admin,
        "galiojimas vienam mėnesiui",
        "",
        "",
      );
    } else if (timeChange === "threeMonths") {
      check = true;
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 3);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(
        user.email,
        admin,
        "galiojimas triems mėnesiams",
        "",
        "",
      );
    } else if (timeChange === "sixMonths") {
      check = true;
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 6);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(
        user.email,
        admin,
        "galiojimas šešiem mėnesiam",
        "",
        "",
      );
    } else if (timeChange === "nineMonths") {
      check = true;
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 9);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(
        user.email,
        admin,
        "galiojimas deviniem mėnesiam",
        "",
        "",
      );
    } else if (timeChange === "oneYear") {
      check = true;
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 12);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(user.email, admin, "galiojimas metams", "", "");
    } else if (timeChange === "twoYears") {
      check = true;
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 24);
      changeDate(user?.id, currentDate);
      createInfoChangeLog(user.email, admin, "galiojimas dviem metais", "", "");
    }
  }

  //Checking if we need to change the email
  if (user?.email !== emailChange && emailChange !== "" && user?.email) {
    check = true;
    await changeCodeEmail(user.email, emailChange);
    await changeUserEmail(user.id, emailChange, admin, user.email);
  }
  if (check) {
    return user;
  }
}

async function changeFirstName(
  userID: string,
  firstNameChange: string,
  admin: string,
  originalName: string,
) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      firstName: firstNameChange,
    },
  });
  createInfoChangeLog(
    changeInfo.email,
    admin,
    "varda",
    originalName,
    firstNameChange,
  );
  return changeInfo;
}

async function changeLastName(
  userID: string,
  lastNameChange: string,
  admin: string,
  originalName: string,
) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      lastName: lastNameChange,
    },
  });
  createInfoChangeLog(
    changeInfo.email,
    admin,
    "pavarde",
    originalName,
    lastNameChange,
  );
  return changeInfo;
}

async function changeUserName(
  userID: string,
  userNameChange: string,
  admin: string,
  originalName: string,
) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      userName: userNameChange,
    },
  });
  createInfoChangeLog(
    changeInfo.email,
    admin,
    "slapyvardi",
    originalName,
    userNameChange,
  );
  return changeInfo;
}

async function changeUserEmail(
  userID: string,
  emailChange: string,
  admin: string,
  originalName: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
  });

  if (user?.email) {
    createInfoChangeLog(
      user?.email,
      admin,
      "el. pašta",
      originalName,
      emailChange,
    );
  }

  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      email: emailChange,
    },
  });
  return changeInfo;
}

async function changeRole(
  userID: string,
  roleChange: string,
  admin: string,
  originalName: string,
) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      role: roleChange,
    },
  });
  createInfoChangeLog(
    changeInfo.email,
    admin,
    "role",
    originalName,
    roleChange,
  );
  return changeInfo;
}

async function changePercentage(
  userID: string,
  percentageChange: string,
  admin: string,
  originalName: string,
) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      percentage: percentageChange,
    },
  });
  createInfoChangeLog(
    changeInfo.email,
    admin,
    "atlygis nuo vartotojo",
    originalName,
    percentageChange,
  );
  return changeInfo;
}

async function changeDate(userID: string, dateChange: Date) {
  const changeInfo = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      expiringAt: dateChange,
    },
  });

  return changeInfo;
}

export async function checkBanStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user?.userStatus === "Užblokuota") {
    return true;
  }
  return false;
}

export async function checkContractExpiration(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.expiringAt && new Date(user.expiringAt) < new Date()) {
    return true;
  }

  return false;
}

export async function checkingThirtyDaysLeft(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.expiringAt) {
    const currentDate = new Date();
    const expirationDate = new Date(user.expiringAt);
    const millisecondsInDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    // Calculate the difference in milliseconds between the current date and expiration date
    const differenceInMs = expirationDate.getTime() - currentDate.getTime();

    // Calculate the difference in days
    const differenceInDays = Math.ceil(differenceInMs / millisecondsInDay);

    // Check if less than 31 days are remaining until expiration
    if (differenceInDays < 31) {
      return true;
    }
  }

  return false;
}

export async function getUserBalanceById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return Number(user?.balance);
}
