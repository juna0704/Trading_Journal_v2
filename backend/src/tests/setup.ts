import { prisma } from "../config";
import { cleanDatabase } from "./helper";

// This runs before every single test file
beforeAll(async () => {
  await cleanDatabase();
});

// This runs after all tests in a file finish
afterAll(async () => {
  await prisma.$disconnect();
});
