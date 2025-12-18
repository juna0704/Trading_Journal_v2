import { Response } from "express";
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

  async login(req: AuthRequest, res: Response): Promise<void> {
    const { user, tokens } = await authService.login(req.body);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
    res.status(200).json(response);
  }

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);

    const response: ApiResponse = {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.status(200).json(response);
  }

  async logout(req: Request, res: Response) {}
}
