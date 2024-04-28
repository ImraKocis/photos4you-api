import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private prismaService: PrismaService) {}

  async create(postId: number, imageData: string[]): Promise<void> {
    try {
      await this.prismaService.image.createMany({
        data: imageData.map((image) => ({ data: image, postId: postId })),
      });
    } catch (e) {
      console.log(e);
    }
  }
}
