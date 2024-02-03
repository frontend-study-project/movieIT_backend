import { User } from "@prisma/client";

export type UpdateDto = Pick<User, 'username'>