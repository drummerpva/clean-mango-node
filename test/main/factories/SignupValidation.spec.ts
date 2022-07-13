import { makeSignUpValidation } from "../../../src/main/factories/SignupValidation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../../src/presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validator/ValidationComposite";

jest.mock("../../../src/presentation/helpers/validator/ValidationComposite");

describe("SignupValidation Factory", () => {
  test("Should calll ValidationComposite with all validations", () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
