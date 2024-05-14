import { describe, it, expect, vi } from "vitest";

import {
  getUserById,
  getUserByEmail,
  createUser,
  deleteUserByEmail,
  verifyLogin,
  checkIfUserNameExists,
} from "../models/user.server";
import { PrismaClient, User } from "@prisma/client"; // Import PrismaClient and User types
import { Decimal } from "@prisma/client/runtime/library";

// Define a custom mock for Prisma client
const mockPrismaClient = {
  $connect: vi.fn(),
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  secretCodeAdmin: {
    findFirst: vi.fn(),
  },
};

// Mock the Prisma client
vi.mock("../db.server", () => ({
  prisma: mockPrismaClient,
}));

/// Mock bcrypt
vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe("validate getUserById", () => {
  it("returns user if user exists", async () => {
    const date = new Date();

    const mockUser: User | null = {
      id: "1",
      email: "test@example.com",
      firstName: "Vardas",
      lastName: "Pavarde",
      userName: "slapyvardis",
      createdAt: date,
      updatedAt: date,
      expiringAt: date,
      role: "Darbuotojas",
      percentage: "1",
      warningAmount: "0",
      balance: 1.0 as unknown as Decimal,
      rating: 0,
      ratingAmount: 0,
      userStatus: "Aktyvi",
      firstWarningDate: date,
      secondWarningDate: date,
      thirdWarningDate: date,
      firstWarning: "a",
      secondWarning: "a",
      thirdWarning: "a",
      banReason: "a",
    };

    mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
    const result = await getUserById("1");
    expect(result).toEqual(mockUser);
  });

  it("returns null if user does not exist", async () => {
    mockPrismaClient.user.findUnique.mockResolvedValue(null);
    const result = await getUserById("2");
    expect(result).toBeNull();
  });
});

/*describe("validate getUserByEmail", () => {
  it("returns user if email exists", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    const result = await getUserByEmail("test@example.com");
    expect(result).toEqual(mockUser);
  });

  it("returns null if email does not exist", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await getUserByEmail("nonexistent@example.com");
    expect(result).toBeNull();
  });
});

describe("validate createUser", () => {
  it("creates a new user if secret code is valid and username does not exist", async () => {
    const mockSecretCode = {
      id: "1",
      secretCode: "validCode",
      ExpirationDate: new Date(),
      role: "User",
      percentage: "50",
    };
    const mockUser = {
      id: "1",
      email: "test@example.com",
      userName: "testUser",
    };
    prisma.secretCodeAdmin.findFirst.mockResolvedValue(mockSecretCode);
    prisma.user.findFirst.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    prisma.user.create.mockResolvedValue(mockUser);

    const result = await createUser(
      "test@example.com",
      "password",
      "First",
      "Last",
      "testUser",
      "validCode",
    );
    expect(result).toEqual(mockUser);
  });

  it("returns null if secret code is invalid", async () => {
    prisma.secretCodeAdmin.findFirst.mockResolvedValue(null);
    const result = await createUser(
      "test@example.com",
      "password",
      "First",
      "Last",
      "testUser",
      "invalidCode",
    );
    expect(result).toBeNull();
  });

  it("returns null if username already exists", async () => {
    const mockSecretCode = {
      id: "1",
      secretCode: "validCode",
      ExpirationDate: new Date(),
      role: "User",
      percentage: "50",
    };
    prisma.secretCodeAdmin.findFirst.mockResolvedValue(mockSecretCode);
    prisma.user.findFirst.mockResolvedValue({ userName: "testUser" });

    const result = await createUser(
      "test@example.com",
      "password",
      "First",
      "Last",
      "testUser",
      "validCode",
    );
    expect(result).toBeNull();
  });
});

describe("validate deleteUserByEmail", () => {
  it("deletes user if email exists", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    prisma.user.delete.mockResolvedValue(mockUser);

    const result = await deleteUserByEmail("test@example.com");
    expect(result).toEqual(mockUser);
  });

  it("throws error if email does not exist", async () => {
    prisma.user.delete.mockRejectedValue(new Error("User not found"));

    await expect(deleteUserByEmail("nonexistent@example.com")).rejects.toThrow(
      "User not found",
    );
  });
});

describe("validate verifyLogin", () => {
  it("returns user without password if login is successful", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: { hash: "hashedPassword" },
    };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await verifyLogin("test@example.com", "password");
    expect(result).toEqual({ id: "1", email: "test@example.com" });
  });

  it("returns null if user does not exist", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await verifyLogin("nonexistent@example.com", "password");
    expect(result).toBeNull();
  });

  it("returns null if password is incorrect", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: { hash: "hashedPassword" },
    };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const result = await verifyLogin("test@example.com", "wrongPassword");
    expect(result).toBeNull();
  });
});

describe("validate checkIfUserNameExists", () => {
  it("returns false if username doesn't exist", async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    const result = await checkIfUserNameExists("");
    expect(result).toBe(false);
  });

  it("returns true if username exists", async () => {
    prisma.user.findFirst.mockResolvedValue({ userName: "Darbuotojas" });
    const result = await checkIfUserNameExists("Darbuotojas");
    expect(result).toBe(true);
  });

  it("returns false if username is not found", async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    const result = await checkIfUserNameExists("NonExistingUser");
    expect(result).toBe(false);
  });
});*/
