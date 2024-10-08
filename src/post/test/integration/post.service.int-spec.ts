import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostService } from '../../post.service';
import { Test } from '@nestjs/testing';
import * as argon from 'argon2';
import { SubscriptionService } from '../../../subscription/subscription.service';

describe('PostService', () => {
  let prisma: PrismaService;
  let postService: PostService;
  let subscriptionService: SubscriptionService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    postService = moduleRef.get(PostService);
    subscriptionService = moduleRef.get(SubscriptionService);
  });

  describe('createPost', () => {
    let userId: string;
    const postDto = {
      description: 'My new post from America',
      hashtags: ['america', 'travel', 'family'],
      image: {
        url: 'https://docs.nestjs.com/assets/logo-small-gradient.svg',
        size: '5',
      },
    };
    const postDtoWithoutImage = {
      description: 'My new post from America',
      hashtags: ['america', 'travel', 'family'],
      image: null,
    };
    it('should create user and subscription', async () => {
      const passwordHash = await argon.hash('password123');
      const user = await prisma.user.create({
        data: {
          email: 'inttest@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash,
        },
      });

      userId = user.id.toString();

      const subscriptionData =
        await subscriptionService.getSubscriptionData('FREE');
      await prisma.subscription.create({
        data: {
          name: 'FREE',
          userId: user.id,
          uploadSizeId: subscriptionData.size,
          dailyLimitId: subscriptionData.limit,
        },
      });
    });
    it('should create post', async () => {
      const post = await postService.create({ ...postDto, userId: userId });
      expect(post.description).toBe(postDto.description);
      expect(post.hashtags).toStrictEqual(postDto.hashtags);
      expect(post.userId).toBe(Number(userId));
    });

    it('should throw error with image creation', async () => {
      await postService
        .create({
          ...postDtoWithoutImage,
          userId,
        })
        .then((post) => expect(post).toBeUndefined())
        .catch((error) => expect(error.status).toBe(500));
    });
  });
});
