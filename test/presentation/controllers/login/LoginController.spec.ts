import { LoginController } from "../../../../src/presentation/controllers/login/LoginController";
import {
  InvalidParamError,
  MissingParamError,
} from "../../../../src/presentation/errors";
import { badRequest } from "../../../../src/presentation/helpers/http-helper";
import { EmailValidator } from "../../../../src/presentation/protocols/EmailValidator";

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};
const makeFakeRequest = () => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});
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
  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new MissingParamError("password")));
  });
  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should return 400 if no invalid mail is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(badRequest(new InvalidParamError("email")));
  });
});
