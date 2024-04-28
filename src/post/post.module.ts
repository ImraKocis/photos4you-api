import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ImageService } from '../image/image.service';

@Module({
  providers: [PostService, ImageService],
  controllers: [PostController],
})
export class PostModule {}
