import { AccountModel } from "../models/Account";

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}
