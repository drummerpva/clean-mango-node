import MissingParamError from "../errors/MissingParamError";
import { badRequest } from "../helpers/http-helper";
import { HttpRequest } from "../protocols/http";

export default class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<any> {
    const requiredFields = ["name", "email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }
  }
}
