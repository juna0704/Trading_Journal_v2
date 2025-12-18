import { Response } from "express";
// import { AuthRequest, ApiResponse } from "../types";
import { AuthService } from "../services/auth.service";
import { ApiResponse, AuthRequest } from "../types";

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const { user, tokens } = await authService.register(req.body);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.status(201).json(response);
  }

  async login(req: Request, res: Response) {
    res.status(200).json({
      message: "User logged in",
      body: req.body,
    });
  }
}
