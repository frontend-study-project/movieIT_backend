import { User } from "@prisma/client";

export type UpdateDto = Pick<User, 'nickname'>;

export type UpdatePasswordDto = {
  newPassword: string;
  newPasswordConfirm: string;
}