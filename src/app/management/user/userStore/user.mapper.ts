// src\app\management\user\userStore\user.mapper.ts
import { ApiUser } from "../models/api-user";
import { User } from "../models/user";


export function mapApiUserToUser(api: ApiUser): User {
  return {
    username: api.username,
    email: api.email,
    mobile: api.mobile,
    firstName: api.firstName,
    middleName: api.middleName,
    lastName: api.lastName,
    gender: api.gender,
    birthDate: api.birthDate,
    roleID: api.roleID,
    isActive: api.isActive,
    twoFactorEnabled: api.twoFactorEnabled,
  };
}


export const mapApiUsersToUsers = (users: ApiUser[]): User[] =>
  users.map(mapApiUserToUser);
