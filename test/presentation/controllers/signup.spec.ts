import SignUpController from "../../../src/presentation/controllers/SignUp";
import MissingParamError from "../../../src/presentation/errors/MissingParamError";

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("Should return 400 if no email is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("Should return 400 if no password is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("Should return 400 if no passwordConfirmation is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
});
