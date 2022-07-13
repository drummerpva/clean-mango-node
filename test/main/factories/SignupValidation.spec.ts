import { makeSignUpValidation } from "../../../src/main/factories/SignupValidation";
import { CompareFieldsValidation } from "../../../src/presentation/helpers/validator/CompareFieldsValidation";
import { EmailValidation } from "../../../src/presentation/helpers/validator/EmailValidation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../../src/presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validator/ValidationComposite";
import { EmailValidatorAdapter } from "../../../src/utils/EmailValidatorAdpter";

jest.mock("../../../src/presentation/helpers/validator/ValidationComposite");

describe("SignupValidation Factory", () => {
  test("Should calll ValidationComposite with all validations", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
