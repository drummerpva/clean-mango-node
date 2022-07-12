import { Authentication } from "../../../domain/usecases/Authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import {
  badRequest,
  callSuccess,
  serverError,
  unathorized,
} from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }
      const { email, password } = httpRequest.body;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) return badRequest(new InvalidParamError("email"));
      const token = await this.authentication.auth(email, password);
      if (!token) return unathorized();
      return callSuccess({ accessToken: token });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
