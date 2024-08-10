import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile } from 'fs';
import { promisify } from 'util';

export interface IPost {
  id: number;
  content: string;
  creator: string;
  circleId: number;
  createdAt: string;
  imagePaths?: string[]; // 支持多个图片路径
}

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

@Scope(ScopeEnum.Singleton)
@Provide('postDBService')
export class PostDBService {
  private getPostsPath(circleId: number): string {
    return `./circle_${circleId}_posts.json`;
  }

  private async list(circleId: number): Promise<IPost[]> {
    const postsPath = this.getPostsPath(circleId);
    console.log(postsPath);
    if (existsSync(postsPath)) {
      const buffer = await readFileAsync(postsPath);
      try {
        return JSON.parse(buffer.toString());
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return []; // 或者抛出错误，看具体需求
      }
    }
    return [];
  }
  

  private async flushCache(circleId: number, list: IPost[]): Promise<void> {
    const postsPath = this.getPostsPath(circleId);
    const data = JSON.stringify(list, null, 2);
    await writeFileAsync(postsPath, data, 'utf-8');
  }

  public async add(content: string, creator: string, circleId: number, imagePaths?: string[]): Promise<IPost> {
    const list = await this.list(circleId);
    const post: IPost = {
      id: await this.incrId(circleId),
      content,
      creator,
      circleId,
      createdAt: new Date().toISOString(),
      imagePaths: imagePaths || [], // 确保 imagePaths 存在，即使为空
    };
    list.push(post);
    await this.flushCache(circleId, list);
    return post;
  }

  public async findById(circleId: number, id: number): Promise<IPost | undefined> {
    const posts = await this.list(circleId);
    return posts.find(post => post.id === id);
  }
  

  public async findByCircleId(circleId: number): Promise<IPost[]> {
    return this.list(circleId);
  }

  private async incrId(circleId: number): Promise<number> {
    const list = await this.list(circleId);
    let maxId = 0;
    for (const { id } of list) {
      if (id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;
  }
}
