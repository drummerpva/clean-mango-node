import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helper";
import { EmailValidator } from "../protocols/EmailValidator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export default class SignUpController {
  constructor(private emailValidator: EmailValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      const { email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError("passwordConfirmation"));
      if (!this.emailValidator.isValid(email))
        return badRequest(new InvalidParamError("email"));
    } catch (error) {
      return serverError();
    }

    return {
      statusCode: 201,
    };
  }
}
