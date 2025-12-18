import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { User, AuthToken } from "../types";
import { prisma } from "../config";

export class AuthService {
  async register(
    data: RegisterInput
  ): Promise<{ user: User; tokens: AuthToken }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    // TODO: Implement registration logic and return user with tokens
    throw new Error("Not implemented");
  }
}
