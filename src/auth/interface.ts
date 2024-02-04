import { User } from "@prisma/client";

export type SignInDto = Pick<User, 'userId' | 'password'>;

export type SignUpDto = User & {
  passwordCheck: User['password'];
}

export type Payload = {
  sub: User['id'],
  user: Omit<User, 'password'>
}