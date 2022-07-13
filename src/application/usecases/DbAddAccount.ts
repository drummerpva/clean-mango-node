import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from "./DbAddAccount-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private hasher: Hasher,
    private repository: AddAccountRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password);
    const accountInsert = await this.repository.add(
      Object.assign({}, account, { password: hashedPassword })
    );
    return accountInsert;
  }
}
