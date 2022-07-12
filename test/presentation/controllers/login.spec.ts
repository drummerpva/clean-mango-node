import { LoginController } from "../../../src/presentation/controllers/login/LoginController";
import { MissingParamError } from "../../../src/presentation/errors";
import { badRequest } from "../../../src/presentation/helpers/http-helper";

const makeSut = () => {
  const sut = new LoginController();
  return {
    sut,
  };
};
describe("LoginController", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new MissingParamError("email")));
  });
});
