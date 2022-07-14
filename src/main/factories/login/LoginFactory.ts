import { DbAuthentication } from "../../../application/usecases/DbAuthentication";
import { BCryptAdapter } from "../../../infra/crypto/BCryptAdapter";
import { JWTAdapter } from "../../../infra/crypto/JWTAdapter";
import { MongoAccountRepository } from "../../../infra/db/mongodb/MongoAccountRepository";
import { MongoLogRepository } from "../../../infra/db/mongodb/MongoLogRepository";
import { LoginController } from "../../../presentation/controllers/login/LoginController";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/LogController";
import { makeLoginValidation } from "./LoginValidation";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
  const hashComaparer = new BCryptAdapter(Number(env.bcryptSalt));
  const jwtAdapter = new JWTAdapter(env.jwtSecret);
  const accountRepository = new MongoAccountRepository();
  const dbAuthentication = new DbAuthentication(
    accountRepository,
    hashComaparer,
    jwtAdapter,
    accountRepository
  );
  const loginValidation = makeLoginValidation();
  const loginController = new LoginController(
    loginValidation,
    dbAuthentication
  );
  const logMongoRepository = new MongoLogRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
