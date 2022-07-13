import {
  InvalidParamError,
  MissingParamError,
} from "../../../../../src/presentation/errors";
import { RequiredFieldValidation } from "../../../../../src/presentation/helpers/validator/RequiredFIeldValidation";
import { HttpRequest } from "../../../../../src/presentation/protocols";

type SutType = {
  sut: RequiredFieldValidation;
};

const makeSut = (): SutType => {
  const sut = new RequiredFieldValidation("field");
  return {
    sut,
  };
};

describe("EmailValidation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const { sut } = makeSut();
    const error = sut.validate({ email: "any_name" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
