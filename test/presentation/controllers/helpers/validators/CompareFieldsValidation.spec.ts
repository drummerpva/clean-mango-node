import { InvalidParamError } from "../../../../../src/presentation/errors";
import { CompareFieldsValidation } from "../../../../../src/presentation/helpers/validator/CompareFieldsValidation";

type SutType = {
  sut: CompareFieldsValidation;
};

const makeSut = (): SutType => {
  const sut = new CompareFieldsValidation("field", "fieldToCompare");
  return {
    sut,
  };
};

describe("CompareFields", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_name" });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });
  test("Should not return if validation succeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: "any_name",
      fieldToCompare: "any_name",
    });
    expect(error).toBeFalsy();
  });
});
