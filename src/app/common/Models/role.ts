export interface Role {
  oid?:string,
  name: string,
  description: string
}

export interface APIRole {
  oid: string,
  name: string,
  description: string
  createdAt: string,
  updatedAt: string
}

