/* eslint-disable no-shadow */

export interface UserAttributes {
  id: string;
  surname: string;
  given_name: string;
  email: string;
  password: string;
  twoFAenabled?: boolean;
  twoFAverified?: boolean;
  role?: Role;
  status?: Status;
  secret?: string | null;

  avatar?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  street?: string;
  confirmationCode?: string;
  googleId?: string;
  resetToken?: string;
  lastPasswordUpdate?: Date;
}

export enum Status {
  Pending = "Pending",
  Active = "Active",
  Needs_Password_Reset = "Needs_Password_Reset",
  Disabled = "Disabled",
}

export enum Role {
  Admin = "Admin",
  Buyer = "Buyer",
  Seller = "Seller",
}
