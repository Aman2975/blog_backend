export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  profileImage?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}