import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile } from 'fs';
import { promisify } from 'util';

// 在文件中定义路径常量
const circlePath = './circle_cache';

export interface ICircle {
    id: number;
    name: string;
    creator:string;
    description: string;
    createdAt: string;
}

const writeFileAsync = promisify(writeFile);

@Scope(ScopeEnum.Singleton)
@Provide('circleDBService')
export class CircleDBService {
    private _circleList: ICircle[] = [];

    async list() {
        if (existsSync(circlePath)) {
            const buffer = await new Promise<Buffer>((resolve, reject) => readFile(circlePath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }));
            this._circleList = JSON.parse(buffer.toString());
        }
        return this._circleList;
    }

    private async flushCache(list: ICircle[]): Promise<void> {
        const data = JSON.stringify(list, null, 2);
        await writeFileAsync(circlePath, data, 'utf-8');
    }

    async add(name: string, description: string,creator:string) {
        const list = await this.list();
        const circle = {
            id: await this.incrId(),
            name,
            description,
            creator,
            createdAt: new Date().toISOString()
        };
        list.push(circle);
        await this.flushCache(list);
        return circle;
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

    async findById(id: number) {
        const list = await this.list();
        console.log("Circle list:", list); // 输出圈子列表
        const circle = list.find((item) => item.id === id);
        if (circle) {
            console.log("Found circle:", circle); // 输出找到的圈子
            return circle;
        } else {
            console.log(`Circle with ID ${id} not found`); // 如果没找到，输出提示
            return null;
        }
    }
    
    
}
