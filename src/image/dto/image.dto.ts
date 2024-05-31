import { IsNotEmpty, IsString} from "class-validator";

export class ImageCreateDto{
    @IsString()
    @IsNotEmpty()
    url: string

    @IsString()
    @IsNotEmpty()
    size: string

    @IsString()
    @IsNotEmpty()
    postId: number
}

export class ImageDataDto{
    @IsString()
    @IsNotEmpty()
    url: string

    @IsString()
    @IsNotEmpty()
    size: string
}