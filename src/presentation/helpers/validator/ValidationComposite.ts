import { Validation } from "./Validation";

export class ValidationComposite implements Validation {
  constructor(private validations: Validation[]) {}
  validate(input: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) return error as Error;
    }
    return null;
  }
}
