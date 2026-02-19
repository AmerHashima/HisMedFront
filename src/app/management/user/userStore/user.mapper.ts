import { ApiUser } from "../models/api-user";
import { User, UserVM } from "../models/user";


export function mapApiUserToUser(api: ApiUser): User {
  return {
    username: api.username,
    email: api.email,
    mobile: api.mobile,
    firstName: api.firstName,
    middleName: api.middleName,
    lastName: api.lastName,
    genderLookupId: api.genderLookupId,
    birthDate: api.birthDate,
    roleId: api.roleId,
    isActive: api.isActive,
    twoFactorEnabled: api.twoFactorEnabled,
  };
}

export function mapApiUserToUserVM(api: ApiUser): UserVM {
  return {
    oid: api.oid,
    username: api.username,
    email: api.email,
    mobile: api.mobile,
    firstName: api.firstName,
    middleName: api.middleName,
    lastName: api.lastName,

    // Lookup mappings
    genderLookupId: api.genderLookupId,
    roleId: api.roleId,

    // Display fields
    fullName: api.fullName,
    genderName: api.genderName,
    roleName: api.roleName,
    birthDate: api.birthDate,
    isActive: api.isActive,
    twoFactorEnabled: api.twoFactorEnabled,
    lastLogin: api.lastLogin,
    failedLoginCount: api.failedLoginCount,
    lockoutEnd: api.lockoutEnd,
    passwordExpiry: api.passwordExpiry,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** API[] → VM[] */
export const mapApiUsersToUserVMs = (users: ApiUser[]): UserVM[] =>
  users.map(mapApiUserToUserVM);

export const mapApiUsersToUsers = (users: ApiUser[]): User[] =>
  users.map(mapApiUserToUser);
