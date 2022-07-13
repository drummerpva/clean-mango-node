import {
  AccountModel,
  AddAccountModel,
} from "../../usecases/DbAddAccount-protocols";

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
