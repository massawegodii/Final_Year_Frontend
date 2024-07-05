export interface User {
  userName: string;
  email: string;
  userFirstName: string;
  userLastName: string;
  userPassword: string;
  imageUrl: string;
  phoneNumber: string;
  jobTitle: string;
  bio: string;
  role: Role[];
  roleName?: string;
}

export interface Role {
  roleName: string;
  roleDescription: string;
}
