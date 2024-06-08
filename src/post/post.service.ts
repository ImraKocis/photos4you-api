import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Post } from "@prisma/client";
import { PostCreateDto, PostFindDto, PostUpdateDto } from "./dto/post.dto";
import { ImageService } from "../image/image.service";
import { PostModule } from "./interface";
import { ApiLogsService } from "../api_logs/api_logs.service";

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private imageService: ImageService,
    private logService: ApiLogsService,
  ) {}

  async latest(): Promise<PostModule[] | null> {
    return this.prismaService.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: { user: true, image: true },
    });
  }

  async all(): Promise<PostModule[] | null> {
    return this.prismaService.post.findMany({
      include: { user: true, image: true },
    });
  }

  async byUser(userId: number): Promise<PostModule[] | null> {
    return this.prismaService.post.findMany({
      where: {
        userId: userId,
      },
      include: { user: true, image: true },
    });
  }

  async create(dto: PostCreateDto): Promise<Post | null> {
    const post = await this.prismaService.post.create({
      data: {
        userId: Number(dto.userId),
        description: dto.description,
        hashtags: dto.hashtags,
      },
    });

    const image = await this.imageService.create({
      ...dto.image,
      postId: post.id,
    });

    await this.logService.createLog({
      action: "Post created",
      userId: Number(dto.userId),
    });
    if (!image) {
      throw new InternalServerErrorException("Failed to create image");
    }

    return post;
  }

  async update(
    id: number,
    dto: PostUpdateDto,
    userId: number,
  ): Promise<Post | null> {
    await this.logService.createLog({
      action: "Post updated",
      description: `Post with ID: ${id} updated`,
      userId,
    });
    return this.prismaService.post.update({
      where: {
        id: Number(id),
      },
      data: {
        hashtags: dto.hashtags,
        description: dto.description,
      },
    });
  }

  async find(dto: PostFindDto): Promise<PostModule[]> {
    const { hashtag, size, fullName, createdAt } = dto;
    return this.prismaService.post.findMany({
      where: {
        AND: [
          hashtag ? { hashtags: { has: hashtag } } : {},
          size
            ? {
                image: {
                  size: {
                    gt: parseFloat(size),
                  },
                },
              }
            : {},
          fullName
            ? {
                user: {
                  OR: [
                    { firstName: { contains: fullName, mode: "insensitive" } },
                    { lastName: { contains: fullName, mode: "insensitive" } },
                  ],
                },
              }
            : {},
          createdAt
            ? {
                createdAt: {
                  gt: createdAt,
                },
              }
            : {},
        ],
      },
      include: {
        user: true,
        image: true,
      },
    });
  }

  async getUniqueHashtags(): Promise<string[]> {
    const posts = await this.prismaService.post.findMany({
      select: {
        hashtags: true,
      },
    });

    return Array.from(new Set(posts.flatMap((post) => post.hashtags)));
  }

  async delete(id: number, userId: number): Promise<boolean | null> {
    await this.logService.createLog({
      action: "Post deleted",
      description: `Post with ID: ${id} deleted`,
      userId,
    });
    const post = await this.prismaService.post.delete({
      where: {
        id: id,
      },
    });

    return !!post;
  }
}
