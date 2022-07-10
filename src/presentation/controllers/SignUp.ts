import MissingParamError from "../errors/MissingParamError";
import { badRequest } from "../helpers/http-helper";
import { HttpRequest } from "../protocols/http";

export default class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<any> {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }
  }
}
