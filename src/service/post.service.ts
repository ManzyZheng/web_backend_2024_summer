import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile } from 'fs';
import { promisify } from 'util';

// 在文件中定义路径常量
const postPath = './post_cache';

export interface IPost {
    id: number;
    content: string;
    authorId: number;
    circleId: number;
    createdAt: string;
    imagePath?: string;  // 图片路径字段
}

const writeFileAsync = promisify(writeFile);

@Scope(ScopeEnum.Singleton)
@Provide('postDBService')
export class PostDBService {
    private _postList: IPost[] = [];

    async list() {
        if (existsSync(postPath)) {
            const buffer = await new Promise<Buffer>((resolve, reject) => readFile(postPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }));
            this._postList = JSON.parse(buffer.toString());
        }
        return this._postList;
    }

    private async flushCache(list: IPost[]): Promise<void> {
        const data = JSON.stringify(list, null, 2);
        await writeFileAsync(postPath, data, 'utf-8');
    }

    async add(content: string, authorId: number, circleId: number, imagePath?: string) {
        const list = await this.list();
        const post = {
            id: await this.incrId(),
            content,
            authorId,
            circleId,
            createdAt: new Date().toISOString(),
            imagePath  // 保存图片路径
        };
        list.push(post);
        await this.flushCache(list);
        return post;
    }

    private async incrId() {
        const list = await this.list();
        let maxId = 0;
        for (const { id } of list) {
            if (id > maxId) {
                maxId = id;
            }
        }
        return maxId + 1;
    }
}
