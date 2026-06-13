import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository";
import { RegisterUserDto } from "./auth.types";
import { LoginDto } from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt";

export const registerUser = async (
  payload: RegisterUserDto
) => {
  const existingUser =
    await authRepository.findUserByEmail(
      payload.email
    );

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    10
  );

  const user =
    await authRepository.createUser(
      payload.name,
      payload.email,
      hashedPassword
    );

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

export const loginUser = async (
  payload: LoginDto
) => {
  const user =
    await authRepository.findUserByEmail(
      payload.email
    );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid =
    await bcrypt.compare(
      payload.password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken =
    generateAccessToken({
      userId: user.id,
      email: user.email,
    });

  const refreshToken =
    generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 7
  );

  await authRepository.createRefreshToken(
    user.id,
    refreshToken,
    expiresAt
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};