import { DbAddAccount } from "../../application/usecases/DbAddAccount";
import { BCryptAdapter } from "../../infra/crypto/BCryptAdapter";
import { MongoAccountRepository } from "../../infra/db/mongodb/MongoAccountRepository";
import SignUpController from "../../presentation/controllers/signup/SignUp";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdpter";
import { LogControllerDecorator } from "../decorators/LogController";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BCryptAdapter(salt);
  // const accountCollection = await MongoHelper.getCollection("accounts");
  const addAccountRepository = new MongoAccountRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const signupController = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signupController);
};
