export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export type IUserDTO = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
};
