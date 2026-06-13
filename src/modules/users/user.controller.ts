import { Response } from "express";

import { AuthRequest } from "../../common/types/auth-request.types";

export const getProfile = async (
  req: any,
  res: Response
): Promise<void> => {
  res.status(200).json({
    success: true,
    userId: req.user.userId,
    email: req.user.email,
  });
};