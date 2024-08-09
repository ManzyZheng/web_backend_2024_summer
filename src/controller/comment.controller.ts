import { Controller, Post, Get, Body, Param, Inject } from '@midwayjs/decorator';
import { CommentDBService } from '../service/comment.service';

@Controller('/api/comments')
export class CommentController {
  @Inject()
  commentDBService: CommentDBService;

  @Post('/')
  async createComment(@Body() body: { postId: number, authorId: number, content: string }) {
    const { postId, authorId, content } = body;
    const comment = await this.commentDBService.add(postId, authorId, content);
    return { success: true, comment };
  }

  @Get('/post/:postId')
  async getCommentsByPostId(@Param() postId: number) {
    const comments = await this.commentDBService.findByPostId(postId);
    return { success: true, comments };
  }
}
