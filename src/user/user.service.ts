import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserCreateModal, UserCreateReturnModal, UserModal } from "./interface";
import { Prisma, Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  UserUpdatePasswordDto,
  UserUpdatePersonalDataDto,
  UserUpdateRoleDto,
  UserUpdateSubscriptionDto,
} from "./dto";
import * as argon from "argon2";
import { DailyLimitService } from "../daily_limit/daily_limit.service";
import { UploadSizeService } from "../upload_size/upload_size.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { ApiLogsService } from "../api_logs/api_logs.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private dailyLimitService: DailyLimitService,
    private uploadSizeService: UploadSizeService,
    private subscriptionService: SubscriptionService,
    private logService: ApiLogsService,
  ) {}

  async userByEmail(email: string): Promise<UserModal | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return this.prisma.exclude(user, ["passwordHash"]);
    } catch (e) {
      return null;
    }
  }

  async createUser(data: UserCreateModal): Promise<UserCreateReturnModal> {
    try {
      await this.logService.createLog({
        action: "User created",
        description: `User created with email ${data.email}`,
      });
      return await this.prisma.user.create({
        data: {
          email: data.email,
          provider: data.provider,
          firstName: data.firstName,
          lastName: data.lastName,
          passwordHash: data.passwordHash,
          avatar: data.picture,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new ForbiddenException("Email already exists");
      }
      throw e;
    }
  }

  async getUserById(
    id: Prisma.UserWhereUniqueInput,
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.findUnique({
      where: id,
      include: { posts: true, subscription: true },
    });
    return this.prisma.exclude(user, ["passwordHash"]);
  }

  async updatePersonalData(
    dto: UserUpdatePersonalDataDto,
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.update({
      where: {
        id: Number(dto.id),
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    await this.logService.createLog({
      action: "User updated",
      description: `User with ID: ${dto.id} personal data updated`,
      userId: Number(dto.id),
    });
    return this.prisma.exclude(user, ["passwordHash"]);
  }

  async updateUserPassword(
    dto: UserUpdatePasswordDto,
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(dto.id) },
    });
    const passwordMatches = await argon.verify(
      user.passwordHash,
      dto.currentPassword,
    );
    if (!passwordMatches) throw new ForbiddenException("incorrect credentials");
    const newPasswordHash = await argon.hash(dto.newPassword);

    const newUserData = await this.prisma.user.update({
      where: { id: Number(dto.id) },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return this.prisma.exclude(newUserData, ["passwordHash"]);
  }

  async updateUserSubscription(
    data: UserUpdateSubscriptionDto,
  ): Promise<UserModal | null> {
    const uploadSizes = await this.uploadSizeService.getAll();
    const dailyLimits = await this.dailyLimitService.getAll();

    const newSubscription = await this.subscriptionService.update(
      {
        id: Number(data.subscriptionId),
        uploadSizeId: uploadSizes.find(
          (element) => element.subscriptionName == data.subscriptionName,
        ).id,
        dailyLimitId: dailyLimits.find(
          (element) => element.subscriptionName == data.subscriptionName,
        ).id,
        oldSubscriptionName: data.odlSubscriptionName,
        newSubscriptionName: data.subscriptionName,
      },
      Number(data.id),
    );

    const user = await this.prisma.user.update({
      where: {
        id: newSubscription.userId,
      },
      data: {
        lastSubscriptionChange: newSubscription.updatedAt,
      },
      include: { posts: true, subscription: true },
    });

    return this.prisma.exclude(user, ["passwordHash"]);
  }

  async getAllUsers(role: Role): Promise<UserModal[]> {
    if (role !== "ADMIN") throw new ForbiddenException("Forbidden access");
    const users = await this.prisma.user.findMany({
      include: { posts: true, subscription: true },
      orderBy: { id: "asc" },
    });

    return users.map((user) => this.prisma.exclude(user, ["passwordHash"]));
  }

  async updateRole(dto: UserUpdateRoleDto): Promise<UserModal> {
    await this.logService.createLog({
      action: "User role updated",
      description: `User with ID: ${dto.id} role updated to ${dto.role}`,
      userId: Number(dto.id),
    });
    const user = await this.prisma.user.update({
      where: {
        id: Number(dto.id),
      },
      data: {
        role: dto.role,
      },
    });

    return this.prisma.exclude(user, ["passwordHash", "hashedRt"]);
  }

  async deleteUser(id: number): Promise<boolean | null> {
    try {
      await this.logService.createLog({
        action: "User deleted",
        description: `User with ID: ${id} deleted`,
        userId: id,
      });
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
        include: { posts: true, subscription: true },
      });
      return !!user;
    } catch (e) {
      return null;
    }
  }
}
