import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {ImageCreateDto} from "./dto";
import {Image} from "@prisma/client";

@Injectable()
export class ImageService {
  constructor(private prismaService: PrismaService) {}

  async create(data: ImageCreateDto): Promise<Image | null> {
    try {
      return await this.prismaService.image.create({
        data: {
          postId: data.postId,
          url: data.url,
          size: parseFloat(data.size),
        }
      });
    } catch (e) {
      console.log(e);
      return null
    }
  }
}
