import { MissingParamError } from "../../../../../src/presentation/errors";
import { Validation } from "../../../../../src/presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../../../../src/presentation/helpers/validator/ValidationComposite";

const makeValidationStub = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
const makeSut = () => {
  const validationStub = makeValidationStub();
  const sut = new ValidationComposite([validationStub]);
  return { sut, validationStub };
};
describe("ValidationComposite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockImplementationOnce(() => new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
