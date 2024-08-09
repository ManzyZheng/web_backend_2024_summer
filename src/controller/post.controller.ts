import { Controller, Post, Get, Body, Param, Inject } from '@midwayjs/decorator';
import { PostDBService } from '../service/post.service';

@Controller('/api/posts')
export class PostController {
  @Inject()
  postDBService: PostDBService;

  @Post('/')
  async createPost(
    @Body() body: { content: string; creator: string; circleId: number; imageUrls?: string[] }
  ) {
    const { content, creator, circleId, imageUrls } = body;
    const post = await this.postDBService.add(content, creator, circleId, imageUrls);
    return { success: true, post };
  }

  @Get('/circle/:circleId')
  async getPostsByCircleId(@Param('circleId') circleId: number) {
    console.log('Fetching posts for circle ID:', circleId);
    const posts = await this.postDBService.findByCircleId(circleId);
    console.log('Posts found:', posts);
    return { success: true, posts };
  }
  

  @Get('/circle/:circleId/:id')
  async getPostById(@Param() circleId: number, @Param() id: number) {
    const post = await this.postDBService.findById(circleId, id);
    if (!post) {
      return { success: false, message: 'Post not found' };
    }
    return { success: true, post };
  }
}
