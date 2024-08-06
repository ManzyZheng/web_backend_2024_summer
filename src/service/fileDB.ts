import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { readFile, existsSync, writeFile } from 'fs';
import { promisify } from 'util';

export interface IUser {
    id: number;
    username: string;
    password: string;
    activity: number;
}

const writeFileAsync = promisify(writeFile);
const userPath = './user_cache';

@Scope(ScopeEnum.Singleton)
@Provide('fileDBService')
export class FileDBService {
    private _userList: IUser[] = [];

    async list() {
        if (existsSync(userPath)) {
            const buffer = await new Promise((resolve, reject) => readFile(userPath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }));
            this._userList = JSON.parse(buffer.toString());
        }
        return this._userList;
    }

    private async flushCache(list: IUser[]): Promise<void> {
        const data = JSON.stringify(list, null, 2);
        await writeFileAsync(userPath, data, 'utf-8');
    }

    async add(username: string, password: string) {
        const list = await this.list();
        const item = await this.findByUsername(username);
        if (item) {
            throw new Error(`username ${username} exists`);
        }
        const activity = 0;
        const user = {
            id: await this.incrId(),
            username,
            password,
            activity
        };
        list.push(user);
        await this.flushCache(list);
        return user;
    }

    async findByUsername(username: string) {
        const list = await this.list();
        const idx = list.findIndex((item) => item.username === username);
        if (idx !== -1) {
            return list[idx];
        }
        return null;
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

    // ...
}