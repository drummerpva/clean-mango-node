import { Authentication } from "../../../../src/domain/usecases/Authentication";
import { LoginController } from "../../../../src/presentation/controllers/login/LoginController";
import { MissingParamError } from "../../../../src/presentation/errors";
import {
  badRequest,
  callSuccess,
  serverError,
  unathorized,
} from "../../../../src/presentation/helpers/http-helper";
import { Validation } from "../../../../src/presentation/helpers/validator/Validation";

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
const makeAtuthentication = () => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
};
const makeSut = () => {
  const validationStub = makeValidation();
  const authenticationStub = makeAtuthentication();
  const sut = new LoginController(validationStub, authenticationStub);
  return {
    sut,
    validationStub,
    authenticationStub,
  };
};
const makeFakeRequest = () => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});
describe("LoginController", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
  });
  test("Should return 401 if invalid credential are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(async () => {
      return null as unknown as string;
    });
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(unathorized());
  });
  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(serverError(new Error()));
  });
  test("Should return 200 and token on success", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(callSuccess({ accessToken: "any_token" }));
  });
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test("Should return 400 if Validation return an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
