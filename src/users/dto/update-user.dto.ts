import { User } from "@prisma/client";

export type UpdateDto = Pick<User, 'nickname'>;

export type UpdatePasswordDto = {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}