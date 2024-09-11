import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PostService } from '../../post.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ImageService } from '../../../image/image.service';
import { ApiLogsService } from '../../../api_logs/api_logs.service';
import { PostCreateDto } from '../../dto/post.dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;
  let imageService: ImageService;
  let logService: ApiLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: ImageService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ApiLogsService,
          useValue: {
            createLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    imageService = module.get<ImageService>(ImageService);
    logService = module.get<ApiLogsService>(ApiLogsService);
  });

  it('should create a post and log the action', async () => {
    // Arrange
    const dto: PostCreateDto = {
      userId: '1',
      description: 'Test post',
      hashtags: ['test', 'nestjs'],
      image: { url: 'image.png', size: '100' },
    };

    const createdPost = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      description: 'Test post',
      hashtags: ['test', 'nestjs'],
    };
    const createdImage = {
      id: 1,
      url: 'image.png',
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      size: 12200,
    };

    jest.spyOn(prismaService.post, 'create').mockResolvedValue(createdPost);
    jest.spyOn(imageService, 'create').mockResolvedValue(createdImage);

    // Act
    const result = await service.create(dto);

    // Assert
    expect(prismaService.post.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        description: dto.description,
        hashtags: dto.hashtags,
      },
    });
    expect(imageService.create).toHaveBeenCalledWith({
      ...dto.image,
      postId: createdPost.id,
    });
    expect(logService.createLog).toHaveBeenCalledWith({
      action: 'Post created',
      userId: 1,
    });
    expect(result).toEqual(createdPost);
  });

  it('should throw an InternalServerErrorException if image creation fails', async () => {
    // Arrange
    const dto: PostCreateDto = {
      userId: '1',
      description: 'Test post',
      hashtags: ['test', 'nestjs'],
      image: { url: 'image.png', size: '100' },
    };

    const createdPost = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      description: 'Test post',
      hashtags: ['test', 'nestjs'],
    };

    jest.spyOn(prismaService.post, 'create').mockResolvedValue(createdPost);
    jest.spyOn(imageService, 'create').mockResolvedValue(null); // Simulate failure in image creation

    // Act & Assert
    await expect(service.create(dto)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
