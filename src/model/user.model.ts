export class User {

    private username: string;

    private userpassword: string;

    constructor(username: string, userpassword: string) {
        this.username = username;
        this.userpassword = userpassword;
    }

    public getUsername() {
        return this.username;
    }

    public getUserpassword() {
        return this.userpassword;
    }
}
