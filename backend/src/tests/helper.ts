import { prisma } from "../config";

export const cleanDatabase = async () => {
  // Delete in order to satisfy Foreign Key constraints
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetAttempt.deleteMany();
  await prisma.user.deleteMany();
};
