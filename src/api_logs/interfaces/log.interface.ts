import { Role } from '@prisma/client';

export interface LogCreateInterface {
  action: string;
  userId?: number;
  description?: string;
  role?: Role;
}
