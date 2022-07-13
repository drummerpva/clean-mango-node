import { Authentication } from "../../../domain/usecases/Authentication";
import {
  badRequest,
  callSuccess,
  serverError,
  unathorized,
} from "../../helpers/http/http-helper";
import { Validation } from "../../protocols/Validation";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);
      if (errorValidation) return badRequest(errorValidation);
      const { email, password } = httpRequest.body;
      const token = await this.authentication.auth({ email, password });
      if (!token) return unathorized();
      return callSuccess({ accessToken: token });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
