import { MongoClient } from "mongodb";
import { AddAccountRepository } from "../../../application/protocols/AddAccountRepository";
import { AccountModel } from "../../../domain/models/Account";
import { AddAccountModel } from "../../../domain/usecases/AddAccount";

export class MongoAccountRepository implements AddAccountRepository {
  constructor(private readonly mongoClient: MongoClient) {}
  add(account: AddAccountModel): Promise<AccountModel> {}
}
