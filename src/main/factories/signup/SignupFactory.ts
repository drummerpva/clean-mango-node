import { DbAddAccount } from "../../../application/usecases/DbAddAccount";
import { BCryptAdapter } from "../../../infra/crypto/BCryptAdapter";
import { MongoAccountRepository } from "../../../infra/db/mongodb/MongoAccountRepository";
import { MongoLogRepository } from "../../../infra/db/mongodb/MongoLogRepository";
import SignUpController from "../../../presentation/controllers/signup/SignUp";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/LogController";
import { makeSignUpValidation } from "./SignupValidation";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const encrypter = new BCryptAdapter(salt);
  const addAccountRepository = new MongoAccountRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const signupController = new SignUpController(
    makeSignUpValidation(),
    addAccount
  );
  const mongoLogRepository = new MongoLogRepository();
  return new LogControllerDecorator(signupController, mongoLogRepository);
};
