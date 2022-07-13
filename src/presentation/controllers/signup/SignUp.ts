import { AddAccount } from "../../../domain/usecases/AddAccount";
import { InvalidParamError } from "../../errors";
import {
  badRequest,
  callSuccess,
  serverError,
} from "../../helpers/http/http-helper";
import { Validation } from "../../helpers/validator/Validation";
import { HttpRequest, HttpResponse } from "./signup-protocols";

export default class SignUpController {
  constructor(private validation: Validation, private addAccount: AddAccount) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidation = this.validation.validate(httpRequest.body);
      if (errorValidation) return badRequest(errorValidation);
      const { name, email, password } = httpRequest.body;
      const account = await this.addAccount.add({ name, email, password });
      return callSuccess(account);
    } catch (error) {
      return serverError(error as unknown as Error);
    }
  }
}
