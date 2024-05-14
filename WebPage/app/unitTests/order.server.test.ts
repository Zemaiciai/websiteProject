import { describe, it, expect, vi } from "vitest";
import { updateOrderStatus } from "../models/order.server";
import { Order, OrderStatus } from "@prisma/client";

const mockPrismaClient = {
  $connect: vi.fn(),
  order: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn().mockReturnValue({ id: "1", status: OrderStatus.CANCELLED }),
  },
  secretCodeAdmin: {
    findFirst: vi.fn(),
  },
};

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe("updateOrderStatus function", () => {
  // Mock the Prisma client
  vi.mock("../db.server", () => ({
    prisma: mockPrismaClient,
  }));

  const mockOrder: Order | null = {
    id: "1",
    orderName: "Order1",
    customerId: "1",
    workerId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    completionDate: new Date(),
    revisionDays: 2,
    orderStatus: OrderStatus.ACCEPTED,
    description: "Aprasymas",
    footageLink: "https://youtube.com",
  };

  it("returns null if order doesn't exist", async () => {
    expect(
      await updateOrderStatus(OrderStatus.CANCELLED, "nonexistent_order_id"),
    ).toBe(null);
  });
});
