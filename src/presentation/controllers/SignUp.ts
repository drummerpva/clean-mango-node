import InvalidParamError from "../errors/InvalidParamError";
import MissingParamError from "../errors/MissingParamError";
import { badRequest } from "../helpers/http-helper";
import { EmailValidator } from "../protocols/EmailValidator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export default class SignUpController {
  constructor(private emailValidator: EmailValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
    const { email } = httpRequest.body;
    if (!this.emailValidator.isValid(email))
      return badRequest(new InvalidParamError("email"));

    return {
      statusCode: 201,
    };
  }
}
