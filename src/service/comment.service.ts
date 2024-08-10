import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile, mkdirSync } from 'fs';
import { promisify } from 'util';
import * as path from 'path';

export interface IComment {
  id: number;
  postId: number;
  circleId: number;
  creator:string;
  content: string;
  createdAt: string;
}

const writeFileAsync = promisify(writeFile);

@Scope(ScopeEnum.Singleton)
@Provide('commentDBService')
export class CommentDBService {
  private getCommentFilePath(circleId: number, postId: number): string {
    return path.join(__dirname, `../../data/comments/circle_${circleId}_post_${postId}_comments.json`);
  }

  private ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (existsSync(dirname)) {
      return true;
    }
    mkdirSync(dirname, { recursive: true });
  }

  async list(circleId: number, postId: number): Promise<IComment[]> {
    const commentFilePath = this.getCommentFilePath(circleId, postId);
    if (existsSync(commentFilePath)) {
      const buffer = await new Promise<Buffer>((resolve, reject) =>
        readFile(commentFilePath, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        })
      );
      return JSON.parse(buffer.toString());
    }
    return [];
  }

  private async flushCache(circleId: number, postId: number, list: IComment[]): Promise<void> {
    const commentFilePath = this.getCommentFilePath(circleId, postId);
    this.ensureDirectoryExistence(commentFilePath);
    const data = JSON.stringify(list, null, 2);
    await writeFileAsync(commentFilePath, data, 'utf-8');
  }

  async add(circleId: number, postId: number, creator: string, content: string) {
    const list = await this.list(circleId, postId);
    const comment: IComment = {
      id: await this.incrId(circleId, postId),
      circleId,
      postId,
      creator,
      content,
      createdAt: new Date().toISOString(),
    };
    list.push(comment);
    await this.flushCache(circleId, postId, list);
    return comment;
  }

  async findByPostId(circleId: number, postId: number) {
    return await this.list(circleId, postId);
  }

  private async incrId(circleId: number, postId: number) {
    const list = await this.list(circleId, postId);
    let maxId = 0;
    for (const { id } of list) {
      if (id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;
  }
}
