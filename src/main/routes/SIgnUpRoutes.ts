import { Router } from "express";
import { adaptRoute } from "../adapters/ExpressRouteAdapter";
import { makeSignUpController } from "../factories/signup/SignupFactory";

export default (router: Router): void => {
  router.post("/signup", adaptRoute(makeSignUpController()));
};
