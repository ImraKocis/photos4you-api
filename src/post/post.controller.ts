import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostCreateDto, PostUpdateDto } from "./dto/post.dto";
import { JwtGuard } from "../auth/guard";
import { GetCurrentUserId } from "../auth/decorator";
import { PostModule } from "./interface";
import { Post as PostOnlyModule } from "@prisma/client";

@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get("latest")
  async getLatest(): Promise<PostModule[] | null> {
    return this.postService.latest();
  }

  @Get("all")
  async getAllPosts(): Promise<PostModule[] | null> {
    return this.postService.all();
  }

  @UseGuards(JwtGuard)
  @Get("user")
  async getUserPosts(
    @GetCurrentUserId() userId: number,
  ): Promise<PostModule[] | null> {
    console.log("user id", userId);
    return this.postService.byUser(userId);
  }

  @UseGuards(JwtGuard)
  @Post("create")
  async createPost(@Body() data: PostCreateDto): Promise<PostOnlyModule> {
    console.log("post controller", data);
    return this.postService.create(data);
  }

  @UseGuards(JwtGuard)
  @Patch(":id")
  async updatePost(
    @GetCurrentUserId() userId: number,
    @Param("id")
    id: string,
    @Body() data: PostUpdateDto,
  ): Promise<PostOnlyModule> {
    return this.postService.update(Number(id), data);
  }

  @Get("find")
  async findPosts(
    @Query("size") size?: string,
    @Query("hashtag") hashtag?: string,
    @Query("fullName") fullName?: string,
    @Query("createdAt") createdAt?: Date,
  ): Promise<PostModule[]> {
    return this.postService.find({
      size,
      hashtag,
      fullName,
      createdAt,
    });
  }

  @Get("hashtags")
  async getHashtags(): Promise<string[]> {
    return this.postService.getUniqueHashtags();
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async deletePost(@Param("id") id: string): Promise<boolean> {
    return this.postService.delete(Number(id));
  }
}
