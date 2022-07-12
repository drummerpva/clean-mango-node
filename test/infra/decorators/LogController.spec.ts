import { LogRepository } from "../../../src/application/protocols/LogRepository";
import { AccountModel } from "../../../src/domain/models/Account";
import { LogControllerDecorator } from "../../../src/main/decorators/LogController";
import {
  callSuccess,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../../src/presentation/protocols";

const makeLogErrorRepositorytub = () => {
  class LogErrorRepositoryStub implements LogRepository {
    async log(stackError: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub();
};
const makeControllerStub = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(callSuccess(makeFakeAccount()));
    }
  }
  return new ControllerStub();
};

const makeSut = () => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepositorytub();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );

  return { sut, controllerStub, logErrorRepositoryStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});
const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});
const makeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

describe("LogControllerDecorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });
  test("Should return http response from controller", async () => {
    const { sut } = makeSut();
    const account = await sut.handle(makeFakeRequest());
    expect(account).toEqual(callSuccess(makeFakeAccount()));
  });
  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(Promise.resolve(makeServerError()));
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
