import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface AccessTokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (
  payload: AccessTokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (
  payload: AccessTokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {

  // console.log("Verifying access token:", token);
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
};