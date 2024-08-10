import { Controller, Post, Inject, Files } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import * as path from 'path';
import * as fs from 'fs/promises';

@Controller('/api/upload')
export class UploadController {
  @Inject()
  ctx: Context;

  @Post('/')
  async upload(@Files() files) {
    try {
      // 打印文件信息以帮助调试
      console.log('Received files:', files);

      // 根据文件数据结构检查文件
      if (!files || !Array.isArray(files) || files.length === 0) {
        return { success: false, message: 'No files received' };
      }

      const uploadedFiles = Array.isArray(files) ? files : [files];
      const urls = [];

      // 确保上传目录存在
      const uploadDir = path.join(__dirname, '../../public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of uploadedFiles) {
        if (!file || !file.data) {
          console.error('Invalid file data:', file);
          continue;
        }

        // 生成唯一文件名
        const fileName = `${Date.now()}_${file.filename}`;
        const filePath = path.join(uploadDir, fileName);

        // 移动文件到上传目录
        await fs.rename(file.data, filePath);

        // 生成文件访问的 URL
        const fileUrl = `${this.ctx.origin}/uploads/${fileName}`;
        console.log('Generated file URL:', fileUrl);
        urls.push(fileUrl);
      }

      console.log('Uploaded file URLs:', urls);
      return { success: true, urls };
    } catch (error) {
      console.error('File upload failed:', error);
      return { success: false, message: 'File upload failed', error: error.message };
    }
  }
}