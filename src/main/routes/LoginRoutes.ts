import { Router } from "express";
import { adaptRoute } from "../adapters/ExpressRouteAdapter";
import { makeLoginController } from "../factories/login/LoginFactory";
import { makeSignUpController } from "../factories/signup/SignupFactory";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
