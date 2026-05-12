import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

declare global {
  var __payrollPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!global.__payrollPrisma) {
    if (process.env.NODE_ENV === "production") {
      const dbPath = path.join(process.cwd(), "prisma", "dev.db");
      const tmpPath = "/tmp/dev.db";
      
      try {
        if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
          fs.copyFileSync(dbPath, tmpPath);
        }
      } catch (e) {
        console.error("Failed to copy sqlite file", e);
      }

      global.__payrollPrisma = new PrismaClient({
        datasources: {
          db: {
            url: "file:/tmp/dev.db"
          }
        }
      });
    } else {
      global.__payrollPrisma = new PrismaClient();
    }
  }

  return global.__payrollPrisma;
}
