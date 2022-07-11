import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from "./DbAddAccount-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private encrypter: Encrypter,
    private repository: AddAccountRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    await this.repository.add(
      Object.assign({}, account, { password: hashedPassword })
    );
    return {
      id: "",
      name: "",
      email: "",
      password: "",
    };
  }
}
