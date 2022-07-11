import { LogControllerDecorator } from "../../../src/main/decorators/LogController";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../../src/presentation/protocols";

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 201,
        body: {
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
        },
      };
      return Promise.resolve(httpResponse);
    }
  }
  return new ControllerStub();
};

const makeSut = () => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
};

describe("LogControllerDecorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        name: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toBeCalledWith(httpRequest);
  });
  test("Should return http response from controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        name: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const account = await sut.handle(httpRequest);
    expect(account.statusCode).toBe(201);
    expect(account.body.name).toBe("any_name");
  });
});
