import { prisma } from "../../config/database";
import { UpdateProfileDto } from "./user.types";

export const findById = async (
  userId: string
) => {
  return prisma.users.findUnique({
    where: {
      id: userId,
    },
  });
};

export const updateProfile = async (
  userId: string,
  payload: UpdateProfileDto
) => {
  return prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      bio: payload.bio,
      profile_image: payload.profileImage,
    },
  });
};

export const updatePassword = async (
  userId: string,
  hashedPassword: string
) => {
  return prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};