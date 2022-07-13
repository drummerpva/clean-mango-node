import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/EmailValidator";
import { Validation } from "../../protocols/Validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}
  validate(input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName]))
      return new InvalidParamError(this.fieldName);
    return null;
  }
}
