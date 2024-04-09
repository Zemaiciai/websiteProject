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
  changeCodeExpiring,
  changeCodePercentage,
  markCodeAsUsed,
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
          hash: hashedPassword,
        },
      },
    },
  });
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

  let currentDate: Date | null = user?.expiringAt ?? null;

  if (currentDate !== null && timeChange !== "holder") {
    if (timeChange === "oneMonth") {
      currentDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    } else if (timeChange === "threeMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 3);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    } else if (timeChange === "sixMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 6);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    } else if (timeChange === "nineMonths") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 9);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    } else if (timeChange === "oneYear") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 12);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    } else if (timeChange === "twoYears") {
      const currentMonth = currentDate.getMonth();
      currentDate.setMonth(currentMonth + 24);
      createInfoChangeLog(findEMAIL, admin, "galiojimas", "", "");
    }

    if (
      firstNameChange &&
      user?.firstName &&
      firstNameChange !== user.firstName
    ) {
      const what = user.firstName;
      createInfoChangeLog(
        findEMAIL,
        admin,
        "varda",
        user.firstName,
        firstNameChange,
      );
    }
    if (lastNameChange && user?.lastName && lastNameChange !== user.lastName) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "pavarde",
        user.lastName,
        lastNameChange,
      );
    }

    if (nickNameChange && user?.userName && nickNameChange !== user.userName) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "slapyvardi",
        user.userName,
        nickNameChange,
      );
    }

    if (
      percentageChange &&
      user?.percentage &&
      percentageChange !== user.percentage &&
      percentageChange !== ""
    ) {
      changeCodePercentage(findEMAIL, percentageChange);
      createInfoChangeLog(
        findEMAIL,
        admin,
        "atlygis nuo vartotojo",
        user.percentage,
        percentageChange,
      );
    }

    if (emailChange && user?.email && emailChange !== user.email) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "el. paštą",
        user.email,
        emailChange,
      );
    }

    if (roleChange && user?.role && roleChange !== user.role) {
      createInfoChangeLog(findEMAIL, admin, "rolę", user.role, roleChange);
    }

    const changeInfo = await prisma.user.update({
      where: {
        email: findEMAIL,
      },
      data: {
        firstName: firstNameChange,
        lastName: lastNameChange,
        userName: nickNameChange,
        role: roleChange,
        email: emailChange,
        percentage: percentageChange,
        expiringAt: currentDate !== null ? currentDate : undefined,
      },
    });
    changeCodeExpiring(findEMAIL, currentDate);

    if (percentageChange !== "") {
      changeCodePercentage(findEMAIL, percentageChange);
    }

    return changeInfo;
  } else {
    if (
      firstNameChange &&
      user?.firstName &&
      firstNameChange !== user.firstName
    ) {
      const what = user.firstName;
      createInfoChangeLog(
        findEMAIL,
        admin,
        "varda",
        user.firstName,
        firstNameChange,
      );
    }
    if (lastNameChange && user?.lastName && lastNameChange !== user.lastName) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "pavarde",
        user.lastName,
        lastNameChange,
      );
    }

    if (nickNameChange && user?.userName && nickNameChange !== user.userName) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "slapyvardi",
        user.userName,
        nickNameChange,
      );
    }

    if (
      percentageChange &&
      user?.percentage &&
      percentageChange !== user.percentage &&
      percentageChange !== ""
    ) {
      changeCodePercentage(findEMAIL, percentageChange);
      createInfoChangeLog(
        findEMAIL,
        admin,
        "atlygis nuo vartotojo",
        user.percentage,
        percentageChange,
      );
    }

    if (emailChange && user?.email && emailChange !== user.email) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "el. paštą",
        user.email,
        emailChange,
      );
    }

    const changeInfo = await prisma.user.update({
      where: {
        email: findEMAIL,
      },
      data: {
        firstName: firstNameChange,
        lastName: lastNameChange,
        userName: nickNameChange,
        role: roleChange,
        email: emailChange,
        percentage: percentageChange,
      },
    });

    if (emailChange && user?.email && emailChange !== user.email) {
      createInfoChangeLog(
        findEMAIL,
        admin,
        "el. paštą",
        user.email,
        emailChange,
      );
    }

    return changeInfo;
  }
}
