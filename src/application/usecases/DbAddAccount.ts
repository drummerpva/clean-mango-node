import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from "./DbAddAccount-protocols";

export class DbAddAccount implements AddAccount {
  constructor(private encrypter: Encrypter) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return {
      id: "",
      name: "",
      email: "",
      password: "",
    };
  }
}
