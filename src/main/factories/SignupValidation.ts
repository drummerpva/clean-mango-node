import { RequiredFieldValidation } from "../../presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../presentation/helpers/validator/ValidationComposite";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
