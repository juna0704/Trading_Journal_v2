import { Request, Response } from "express";
// import { AuthRequest, ApiResponse } from "../types";
import { AuthService } from "../services/auth.service";

export class AuthController {
  async register(req: Request, res: Response) {
    res.status(201).json({
      message: "User registered",
      body: req.body,
    });
  }

  async login(req: Request, res: Response) {
    res.status(200).json({
      message: "User logged in",
      body: req.body,
    });
  }
}
