import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role, User } from "@prisma/client";

export const GetCurrentUserRole = createParamDecorator(
  (_: undefined, context: ExecutionContext): Role => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return user.role;
  },
);
