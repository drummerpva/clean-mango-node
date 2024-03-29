import { EmailValidatorAdapter } from "../../src/utils/EmailValidatorAdpter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe("EmailValidatorAdapter", () => {
  test("Shoul return false if validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
  test("Shoul return true if validator returns true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });
  test("Shoul call validator with correct value", () => {
    const sut = makeSut();
    const isEmailSpy = jest
      .spyOn(validator, "isEmail")
      .mockReturnValueOnce(false);
    sut.isValid("any_email@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
