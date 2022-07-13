import { EmailValidation } from "../../../src/presentation/helpers/validator/EmailValidation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../../src/presentation/protocols/Validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validator/ValidationComposite";
import { EmailValidator } from "../../../src/presentation/protocols/EmailValidator";

jest.mock("../../../src/presentation/helpers/validator/ValidationComposite");
const makeLoginValidation = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }
  return new EmailValidatorStub();
};
describe("LoginValidation Factory", () => {
  test("Should calll ValidationComposite with all validations", () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeLoginValidation()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
