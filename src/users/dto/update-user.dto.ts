import { User } from "@prisma/client";

export type UpdateDto = Pick<User, 'username'>;

export type UpdatePasswordDto = {
  newPassword: string;
  newPasswordConfirm: string;
}