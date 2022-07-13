import { InvalidParamError } from "../../../../../src/presentation/errors";
import { EmailValidation } from "../../../../../src/presentation/helpers/validator/EmailValidation";
import { HttpRequest } from "../../../../../src/presentation/protocols";
import { EmailValidator } from "../../../../../src/presentation/protocols/EmailValidator";

type SutType = {
  emailValidatorStub: EmailValidator;
  sut: EmailValidation;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);
  return {
    emailValidatorStub,
    sut,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

describe("EmailValidation", () => {
  test("Should return an error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();
    const error = sut.validate({ email: httpRequest.body.email });
    expect(error).toEqual(new InvalidParamError("email"));
  });
  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = makeFakeRequest();
    sut.validate({ email: httpRequest.body.email });
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test("Should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
