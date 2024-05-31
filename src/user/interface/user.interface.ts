import { Post, Provider, Role, Subscription } from "@prisma/client";

export interface UserModal {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  posts?: Post[];
  subscription?: Subscription;
  lastSubscriptionChange?: Date;
}

export interface UserDeletedModal extends UserModal {
  passwordHash: string;
  hashedRt: string;
}

export interface UserCreateModal {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash?: string;
  provider?: Provider;
  picture?: string;
}

export interface UserCreateReturnModal {
  id: number;
  createdAt: Date;
  email: string;
}
