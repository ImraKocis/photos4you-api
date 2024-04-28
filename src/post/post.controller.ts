import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModule } from '@prisma/client';
import { PostCreateDto, PostUpdateDto } from './dto/post.dto';
import { JwtGuard } from '../auth/guard';
import { GetCurrentUserId } from '../auth/decorator';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('latest')
  async getLatest(): Promise<PostModule[] | null> {
    return this.postService.latest();
  }

  @UseGuards(JwtGuard)
  @Post('create')
  async createPost(@Body() data: PostCreateDto): Promise<PostModule> {
    return this.postService.create(data);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePost(
    @GetCurrentUserId() userId: number,
    @Param('id')
    id: string,
    @Body() data: PostUpdateDto
  ): Promise<PostModule> {
    return this.postService.update(Number(id), userId, data);
  }

  @Get('find')
  async findPosts(
    @Query('description') description?: string,
    @Query('hashtag') hashtag?: string,
    @Query('name') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('createdAt') createdAt?: Date
  ): Promise<PostModule[]> {
    return this.postService.find({
      description,
      hashtag,
      firstName,
      lastName,
      createdAt,
    });
  }
}
