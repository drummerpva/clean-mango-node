import { Express } from "express";
import { BodyParser } from "../midlewares/BodyParser";
export default (app: Express): void => {
  app.use(BodyParser);
};
