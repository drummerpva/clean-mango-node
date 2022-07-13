import { AddAccountRepository } from "../../../application/protocols/repository/AddAccountRepository";
import { LoadAccountByEmailRepository } from "../../../application/protocols/repository/LoadAccountByEmailRepository";
import { AccountModel } from "../../../domain/models/Account";
import { AddAccountModel } from "../../../domain/usecases/AddAccount";
import { MongoHelper } from "./helpers/mongo-helper";

export class MongoAccountRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const { insertedId } = await accountCollection.insertOne(account);
    return {
      id: insertedId.toString(),
      ...account,
    };
  }
  async getAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const accountData = await accountCollection.findOne({ email });
    const account = MongoHelper.map<AccountModel>(accountData);
    return account;
  }
}
