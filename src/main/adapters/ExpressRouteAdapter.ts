import { Request, Response } from "express";
import { Controller, HttpRequest } from "../../presentation/protocols";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    const response = await controller.handle(httpRequest);
    if (response.statusCode === 200)
      return res.status(response.statusCode).json(response.body);
    return res.status(response.statusCode).json({
      error: response.body.message,
    });
  };
};
