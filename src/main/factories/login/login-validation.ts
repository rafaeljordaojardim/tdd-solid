import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new EmailValidation("email", new EmailValidatorAdapter())
  );
  return new ValidationComposite(validations);
};
