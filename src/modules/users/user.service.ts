import * as userRepository from "./user.repository";
import { UpdateProfileDto } from "./user.types";
import { ChangePasswordDto } from "./user.types";
import bcrypt from "bcrypt";

export const updateProfile = async (
  userId: string,
  payload: UpdateProfileDto
) => {
  const user =
    await userRepository.findById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const updatedUser =
    await userRepository.updateProfile(
      userId,
      payload
    );

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    profileImage:
      updatedUser.profile_image,
  };
};

export const changePassword = async (
  userId: string,
  payload: ChangePasswordDto
): Promise<void> => {

  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid =
    await bcrypt.compare(
      payload.oldPassword,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "Old password is incorrect"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      payload.newPassword,
      10
    );

  await userRepository.updatePassword(
    userId,
    hashedPassword
  );
};