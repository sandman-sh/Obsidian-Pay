import { PrismaClient } from "@prisma/client";

declare global {
  var __payrollPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!global.__payrollPrisma) {
    global.__payrollPrisma = new PrismaClient();
  }

  return global.__payrollPrisma;
}
