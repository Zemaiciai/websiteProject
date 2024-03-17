import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

import axios from 'axios';

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
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
 
    const r = await axios.put(
      'https://api.chatengine.io/users/',
      { username: firstName, secret: lastName, first_name: firstName },
      {headers: {"private-key": "c4fc041f-6d9a-4305-9d09-aca41bde03f3"}}
    )
   
  
  return prisma.user.create({
    data: {
      email,
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: {
        create: {
<<<<<<< HEAD
          hash: hashedPassword
        }
      }
    }
  }
  );
=======
          hash: hashedPassword,
        },
      },
    },
  });
>>>>>>> 17d373ddeb5ad3f54ef960f952d597910381d985
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
