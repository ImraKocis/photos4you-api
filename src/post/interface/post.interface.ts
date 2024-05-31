import {Image, Post, User} from "@prisma/client";

export interface PostModule extends Post{
    user: User
    image: Image
}
