import { AccountModel } from "../../domain/models/Account";
import { AddAccount, AddAccountModel } from "../../domain/usecases/AddAccount";
import { Encrypter } from "../protocols/Encrypter";

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
