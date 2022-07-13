import { CompareFieldsValidation } from "../../presentation/helpers/validator/CompareFieldsValidation";
import { EmailValidation } from "../../presentation/helpers/validator/EmailValidation";
import { RequiredFieldValidation } from "../../presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../presentation/helpers/validator/ValidationComposite";
import { EmailValidatorAdapter } from "../../utils/EmailValidatorAdpter";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation")
  );
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
