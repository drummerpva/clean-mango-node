import { Express } from "express";
import { BodyParser, Cors, ContentType } from "../midlewares";
export default (app: Express): void => {
  app.use(BodyParser);
  app.use(Cors);
  app.use(ContentType);
};
