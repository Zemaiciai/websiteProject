import { describe, beforeEach, it, expect, vi } from "vitest";
import * as orderServer from "../models/order.server";
import { Order, OrderStatus } from "@prisma/client";
import prismaMock from "../__mocks__/prisma";
import { User } from "../models/user.server";
import { Decimal } from "@prisma/client/runtime/library";

vi.mock("../models/order.server");

// Mock data for testing
const mockUser: User = {
  id: "1",
  email: "email@gmail.com",
  firstName: "Vardas",
  lastName: "Pavarde",
  userName: "userName",
  createdAt: new Date(),
  updatedAt: new Date(),
  expiringAt: new Date(),
  warningAmount: "0",
  firstWarning: "",
  firstWarningDate: new Date(),
  secondWarning: "",
  secondWarningDate: new Date(),
  thirdWarning: "",
  thirdWarningDate: new Date(),
  banReason: "",
  role: "admin",
  percentage: "30%",
  balance: 1.0 as unknown as Decimal,
  userStatus: "",
  rating: 1,
  ratingAmount: 1,
};

// Mock order data
const mockOrder: Order = {
  id: "1",
  orderName: "Order1",
  customerId: "clw6j0nny0000wfnb1tl9a0sr",
  workerId: "clw6j0nny0000wfnb1tl9a0sr",
  createdAt: new Date(),
  updatedAt: new Date(),
  completionDate: new Date(),
  revisionDays: 2,
  orderStatus: OrderStatus.PLACED,
  description: "Aprasymas",
  footageLink: "https://youtube.com",
};

describe("order.server", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns order object if order is created successfully", async () => {
    // Mock prisma.order.create to resolve with mockOrder
    prismaMock.order.create.mockResolvedValue(mockOrder);

    // Call createOrder function with mock data
    const createdOrder = await orderServer.createOrder(
      "Order1",
      "clw6j0nny0000wfnb1tl9a0sr", // createdById
      "clw6j0nny0000wfnb1tl9a0sr", // workerId
      new Date(),
      2,
      "Aprasymas",
      "https://youtube.com",
    );

    // Assert that the returned order matches the mockOrder
    expect(createdOrder).toEqual(mockOrder);
  });
});
