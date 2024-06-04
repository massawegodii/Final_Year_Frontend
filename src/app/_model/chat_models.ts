export interface Chat{
    nickName: string;
    fullName: string;
    status: string
}

export interface ProfileUser {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
}
