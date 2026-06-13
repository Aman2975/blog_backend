import { prisma } from "../../config/database";

export const findUserByEmail = async (
  email: string
) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return prisma.users.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const createRefreshToken = async (
  userId: string,
  token: string,
  expiresAt: Date
) => {

  await prisma.refresh_tokens.deleteMany({where:{user_id:userId}})
  return prisma.refresh_tokens.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt,
    },
  });
};