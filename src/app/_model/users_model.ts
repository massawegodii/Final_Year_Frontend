export interface User {
    userName: string;
    email: string;
    userFirstName: string;
    userLastName: string;
    userPassword: string;
    role: Role[];

}

export interface Role {
    roleName: string;
    roleDescription: string
}