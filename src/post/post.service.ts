import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { PostCreateDto, PostFindDto, PostUpdateDto } from './dto/post.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private imageService: ImageService
  ) {}

  async latest(): Promise<Post[] | null> {
    const posts = await this.prismaService.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: { user: true, images: true },
    });

    return posts?.length > 0 ? posts : null;
  }

  async userIdByPost(id: number): Promise<number> {
    const { userId } = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
      },
    });
    return userId;
  }

  async create(dto: PostCreateDto): Promise<Post | null> {
    const post = await this.prismaService.post.create({
      data: {
        userId: Number(dto.userId),
        description: dto.description,
        hashtags: dto.hashtags,
      },
    });

    await this.imageService.create(post.id, dto.images);

    return post;
  }

  async update(
    id: number,
    userId: number,
    dto: PostUpdateDto
  ): Promise<Post | null> {
    const postUserId = await this.userIdByPost(id);
    if (postUserId === userId) {
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
    throw new ForbiddenException('Forbidden update action');
  }

  async find(dto: PostFindDto): Promise<Post[]> {
    return this.prismaService.post.findMany({
      where: {
        OR: [
          {
            hashtags: {
              has: dto.hashtag,
            },
            description: {
              contains: dto.description,
            },
            user: {
              firstName: {
                contains: dto.firstName,
              },
              lastName: {
                contains: dto.lastName,
              },
            },
            createdAt: dto.createdAt,
          },
        ],
      },
    });
  }
}
