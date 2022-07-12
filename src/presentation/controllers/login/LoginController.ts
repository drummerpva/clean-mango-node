import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, callSuccess } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }
    const { email } = httpRequest.body;
    const isValidEmail = this.emailValidator.isValid(email);
    if (!isValidEmail) return badRequest(new InvalidParamError("email"));
    return callSuccess({});
  }
}
