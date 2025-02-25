import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { makeSignupValidation } from "./signup-validation";

jest.mock("../../../presentation/helpers/validators/validation-composite")
class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

describe('SignupValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(
      new EmailValidation("email", new EmailValidatorStub())
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});