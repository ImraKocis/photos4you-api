import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ImageDataDto } from '../../image/dto';
import { Type } from 'class-transformer';

export class PostCreateDto {
  // required
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ImageDataDto)
  image: ImageDataDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  hashtags: string[];

  // optional
  @IsString()
  @IsOptional()
  description?: string;
}

export class PostUpdateDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[];
}

export class PostFindDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  hashtag?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
