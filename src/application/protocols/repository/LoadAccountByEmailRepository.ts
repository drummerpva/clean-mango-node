import { AccountModel } from "../../usecases/DbAddAccount-protocols";

export interface LoadAccountByEmailRepository {
  getAccountByEmail(email: string): Promise<AccountModel>;
}
