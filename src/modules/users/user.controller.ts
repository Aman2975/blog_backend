import { Response, Request } from "express";
import { AuthRequest } from "../../common/types/auth-request.types";
import * as userService from "./user.service";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  
  const authReq = req as AuthRequest;

  try {
    const profile = await userService.getProfile(
      authReq.user.userId
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  
  const authReq = req as AuthRequest;

  try {
    const result = await userService.updateProfile(
      authReq.user.userId,  
      authReq.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const changePassword = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    await userService.changePassword(
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });

  }
};