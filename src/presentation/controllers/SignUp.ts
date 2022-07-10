import MissingParamError from "../errors/MissingParamError";
import { HttpRequest } from "../protocols/http";

export default class SignUpController {
  async handle(httpRequest: HttpRequest): Promise<any> {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError("name"),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError("email"),
      };
    }
  }
}
