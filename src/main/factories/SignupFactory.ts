import { DbAddAccount } from "../../application/usecases/DbAddAccount";
import { BCryptAdapter } from "../../infra/crypto/BCryptAdapter";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { MongoAccountRepository } from "../../infra/db/mongodb/MongoAccountRepository";
import SignUpController from "../../presentation/controllers/signup/SignUp";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdpter";

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BCryptAdapter(salt);
  const accountCollection = MongoHelper.getCollection("accounts");
  const addAccountRepository = new MongoAccountRepository(accountCollection);
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  return new SignUpController(emailValidator, addAccount);
};
