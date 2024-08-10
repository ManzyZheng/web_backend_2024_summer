import { Controller, Post, Get, Body, Param, Inject } from '@midwayjs/decorator';
import { CommentDBService } from '../service/comment.service';

@Controller('/api/comments')
export class CommentController {
  @Inject()
  commentDBService: CommentDBService;

  @Post('/')
  async createComment(
    @Body() body: { circleId: number, postId: number, creator: string, content: string }
  ) {
    const { circleId, postId, creator, content } = body;
    const comment = await this.commentDBService.add(circleId, postId, creator, content);
    return { success: true, comment };
  }

  @Get('/circle/:circleId/post/:postId')
  async getCommentsByPostId(
    @Param('circleId') circleId: string,
    @Param('postId') postId: string
  ) {
    const circleIdNumber = parseInt(circleId, 10);
    const postIdNumber = parseInt(postId, 10);

    if (isNaN(circleIdNumber) || isNaN(postIdNumber)) {
      return { success: false, message: 'Invalid circle ID or post ID' };
    }

    const comments = await this.commentDBService.findByPostId(circleIdNumber, postIdNumber);
    console.log('Comments fetched:', comments);  // Debugging
    return { success: true, comments };
  }

}
