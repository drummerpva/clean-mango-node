import { Express } from "express";
import { BodyParser } from "../midlewares/BodyParser";
import { ContentType } from "../midlewares/ContentType";
import { Cors } from "../midlewares/Cors";
export default (app: Express): void => {
  app.use(BodyParser);
  app.use(Cors);
  app.use(ContentType);
};
