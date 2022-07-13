import { MissingParamError } from "../../../../src/presentation/errors";
import { Validation } from "../../../../src/presentation/helpers/validator/Validation";
import { ValidationComposite } from "../../../../src/presentation/helpers/validator/ValidationComposite";

const makeValidationStub = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};
const makeSut = () => {
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};
describe("ValidationComposite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], "validate")
      .mockImplementationOnce(() => new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  test("Should return the first error if more than one validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockImplementationOnce(() => new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockImplementationOnce(() => new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new Error());
  });
  test("Should not return if validation succeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
