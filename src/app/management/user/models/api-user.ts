// src\app\management\user\models\api-user.ts
export interface ApiUser {
  oid: string;
  username: string;
  email: string;
  mobile: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  birthDate: string;
  roleID: number;
  isActive: boolean;
  lastLogin: string;
  failedLoginCount: number;
  lockoutEnd: string;
  passwordExpiry: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
