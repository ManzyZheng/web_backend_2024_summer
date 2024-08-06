import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile } from 'fs';
import { promisify } from 'util';

// 在文件中定义路径常量
const commentPath = './comment_cache';

export interface IComment {
    id: number;
    postId: number;
    authorId: number;
    content: string;
    createdAt: string;
}

const writeFileAsync = promisify(writeFile);

@Scope(ScopeEnum.Singleton)
@Provide('commentDBService')
export class CommentDBService {
    private _commentList: IComment[] = [];

    async list() {
        if (existsSync(commentPath)) {
            const buffer = await new Promise<Buffer>((resolve, reject) => readFile(commentPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }));
            this._commentList = JSON.parse(buffer.toString());
        }
        return this._commentList;
    }

    private async flushCache(list: IComment[]): Promise<void> {
        const data = JSON.stringify(list, null, 2);
        await writeFileAsync(commentPath, data, 'utf-8');
    }

    async add(postId: number, authorId: number, content: string) {
        const list = await this.list();
        const comment = {
            id: await this.incrId(),
            postId,
            authorId,
            content,
            createdAt: new Date().toISOString()
        };
        list.push(comment);
        await this.flushCache(list);
        return comment;
    }

    async findByPostId(postId: number) {
        const list = await this.list();
        return list.filter((item) => item.postId === postId);
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
