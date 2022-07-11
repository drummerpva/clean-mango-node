import { AddAccountRepository } from "../../../application/protocols/AddAccountRepository";
import { AccountModel } from "../../../domain/models/Account";
import { AddAccountModel } from "../../../domain/usecases/AddAccount";
import { MongoHelper } from "./helpers/mongo-helper";

export class MongoAccountRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const { insertedId } = await accountCollection.insertOne(account);
    return {
      id: insertedId.toString(),
      ...account,
    };
  }
}
