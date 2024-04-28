import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostCreateDto {
  // required
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  // optional
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[];
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
  description?: string;

  @IsString()
  @IsOptional()
  hashtag?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
