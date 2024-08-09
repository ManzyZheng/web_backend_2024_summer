import { Controller, Post, Get, Body, Param, Inject } from '@midwayjs/decorator';
import { CircleDBService } from '../service/circle.service';

@Controller('/api/circles')
export class CircleController {
  @Inject()
  circleDBService: CircleDBService;

  @Post('/')
  async createCircle(@Body() body: { name: string, description: string, creator: string }) {
    const { name, description, creator } = body;
    const circle = await this.circleDBService.add(name, description, creator);
    return { success: true, circle };
  }

  @Get('/')
  async getCircles() {
    const circles = await this.circleDBService.list();
    return { success: true, circles };
  }

  @Get('/:id')
  async getCircleById(@Param('id') id: string) {
    const circleId = parseInt(id, 10);  // 转换为数字
    if (isNaN(circleId)) {
      return { success: false, message: 'Invalid circle ID' };
    }
    const circle = await this.circleDBService.findById(circleId);
    if (circle) {
      return { success: true, circle };
    } else {
      return { success: false, circle: null };
    }
  }
}


