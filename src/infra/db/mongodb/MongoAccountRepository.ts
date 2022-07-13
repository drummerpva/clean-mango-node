import { ObjectId } from "mongodb";
import { AddAccountRepository } from "../../../application/protocols/repository/AddAccountRepository";
import { LoadAccountByEmailRepository } from "../../../application/protocols/repository/LoadAccountByEmailRepository";
import { UpdateAccessTokenRepository } from "../../../application/protocols/repository/UpdateAccessTokenRepository";
import { AccountModel } from "../../../domain/models/Account";
import { AddAccountModel } from "../../../domain/usecases/AddAccount";
import { MongoHelper } from "./helpers/mongo-helper";

export class MongoAccountRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
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
  async updateTokenById(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    );
  }
}
