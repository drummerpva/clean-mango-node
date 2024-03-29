import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from "../../../presentation/helpers/validator";
import { Validation } from "../../../presentation/protocols/Validation";
import { EmailValidatorAdapter } from "../../../utils/EmailValidatorAdpter";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
