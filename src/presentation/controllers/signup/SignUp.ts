import { AddAccount } from "../../../domain/usecases/AddAccount";
import { MissingParamError, InvalidParamError } from "../../errors";
import {
  badRequest,
  callSuccess,
  serverError,
} from "../../helpers/http-helper";
import { Validation } from "../../helpers/validator/Validation";
import { EmailValidator, HttpRequest, HttpResponse } from "./signup-protocols";

export default class SignUpController {
  constructor(
    private validation: Validation,
    private emailValidator: EmailValidator,
    private addAccount: AddAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);
      if (errorValidation) return badRequest(errorValidation);
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError("passwordConfirmation"));
      if (!this.emailValidator.isValid(email))
        return badRequest(new InvalidParamError("email"));
      const account = await this.addAccount.add({ name, email, password });
      return callSuccess(account);
    } catch (error) {
      return serverError(error as unknown as Error);
    }
  }
}
