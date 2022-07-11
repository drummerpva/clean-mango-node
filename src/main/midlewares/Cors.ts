import { NextFunction, Request, Response } from "express";

export const Cors = (req: Request, res: Response, next: NextFunction) => {
  res.set("access-controll-allow-origin", "*");
  res.set("access-controll-allow-methods", "*");
  res.set("access-controll-allow-headers", "*");
  next();
};
