import { EmailValidatorAdapter } from "../../src/utils/EmailValidatorAdpter";

describe("EmailValidatorAdapter", () => {
  test("Shoul return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
});
