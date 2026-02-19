// src\app\management\user\models\user.ts
export interface User {
  oid?: string;
  username: string,
  password?: string,
  email: string,
  mobile: string,
  firstName: string,
  middleName: string,
  lastName: string,
  genderLookupId: string,
  birthDate: string,
  roleId: number,
  isActive: boolean,
  twoFactorEnabled: boolean
}

export interface UserVM extends User {
  oid:string,
  fullName:string,
  genderName:string,
  roleName:string,
  lastLogin:string,
  failedLoginCount:number,
  lockoutEnd:string,
  passwordExpiry:string,
  createdAt:string,
  updatedAt:string
}





