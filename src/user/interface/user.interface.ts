import { Post, Provider, Role, Subscription } from '@prisma/client';

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

export interface UserCreateModal {
  email: string;
  provider: Provider;
  firstName: string;
  lastName: string;
}
