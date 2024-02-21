import { User } from "@prisma/client";

export type SignInDto = Pick<User, 'userId' | 'password'>;

export type SignUpDto = Omit<User, 'id'> & {
  id?: User['id']
  passwordConfirm: User['password'];
}

export type SignUpCineDto = {
  email: string;
  password: string;
  passwordCheck: string;
}

export type SignInCineDto = {
  email: string;
  password: string;
}

export type Payload = {
  sub: User['id'],
  user: Omit<User, 'password'>
}