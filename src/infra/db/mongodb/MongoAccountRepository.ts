import { Collection } from "mongodb";
import { AddAccountRepository } from "../../../application/protocols/AddAccountRepository";
import { AccountModel } from "../../../domain/models/Account";
import { AddAccountModel } from "../../../domain/usecases/AddAccount";

export class MongoAccountRepository implements AddAccountRepository {
  constructor(private accountCollection: Collection) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const { insertedId } = await this.accountCollection.insertOne(account);
    return {
      id: insertedId.toString(),
      ...account,
    };
  }
}
