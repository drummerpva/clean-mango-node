import { EmailValidation } from "../../../presentation/helpers/validator/EmailValidation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validator/RequiredFIeldValidation";
import { Validation } from "../../../presentation/protocols/Validation";
import { ValidationComposite } from "../../../presentation/helpers/validator/ValidationComposite";
import { EmailValidatorAdapter } from "../../../utils/EmailValidatorAdpter";

export const makeSLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
