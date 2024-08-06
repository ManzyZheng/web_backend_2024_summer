import { Provide, Inject } from '@midwayjs/decorator';
import { FileDBService } from './fileDB';

@Provide()
export class UserService {
  @Inject()
  fileDBService: FileDBService;

  private users = [];
  // 将用户数据插入数据库
  async register(username: string, password: string) {
    if (this.users.find(user => user.username === username)) {
      throw new Error('用户名已存在');
    }
    const newUser = { username, password, activity: 0 };
    this.users.push(newUser);
    return await this.fileDBService.add(newUser.username, newUser.password);
  }

  // 检查用户密码是否与数据库中匹配
  async login(username: string, password: string) {
    const user = await this.fileDBService.findByUsername(username);
    if (user.password === password) {
      return true;
    }
    return false;
  }

  async getUsers() {
    return await this.fileDBService.list();
  }

  async getUser(username:string){
    return await this.fileDBService.findByUsername(username);
  }

}