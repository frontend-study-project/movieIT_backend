import { User } from "@prisma/client";

export type SignInDto = Pick<User, 'email' | 'password'>;