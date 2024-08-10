import { Controller, Post, Get, Body, Param, Inject } from '@midwayjs/decorator';
import { PostDBService } from '../service/post.service';
import { UserService } from '../service/auth.service';

@Controller('/api/posts')
export class PostController {
  @Inject()
  postDBService: PostDBService;

  @Inject()
  userService: UserService;

  @Post('/')
  async createPost(
    @Body() body: { content: string; creator: string; circleId: number; imageUrls?: string[] }
  ) {
    const { content, creator, circleId, imageUrls } = body;
    
    const post = await this.postDBService.add(content, creator, circleId, imageUrls);
    return { success: true, post };
  }

  @Get('/circle/:circleId')
  async getPostsByCircleId(@Param('circleId') circleId: string) {
    const circleIdNumber = parseInt(circleId, 10);  // 将字符串转换为数字
    if (isNaN(circleIdNumber)) {
      return { success: false, message: 'Invalid circle ID' };
    }
    console.log('Fetching posts for circle ID:', circleIdNumber);
    const posts = await this.postDBService.findByCircleId(circleIdNumber);
    console.log('Posts found:', posts);
    return { success: true, posts };
  }
  
  @Get('/circle/:circleId/:id')
  async getPostById(
    @Param('circleId') circleId: string, 
    @Param('id') id: string
  ) {
    const circleIdNumber = parseInt(circleId, 10);  // 将字符串转换为数字
    const idNumber = parseInt(id, 10);  // 将字符串转换为数字

    if (isNaN(circleIdNumber) || isNaN(idNumber)) {
      return { success: false, message: 'Invalid circle ID or post ID' };
    }

    const post = await this.postDBService.findById(circleIdNumber, idNumber);
    if (!post) {
      return { success: false, message: 'Post not found' };
    }
    return { success: true, post };
  }
}

