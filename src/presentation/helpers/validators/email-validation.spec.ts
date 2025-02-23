import { EmailValidation } from "./email-validation";
import { EmailValidator } from "../../protocols/email-validator";
class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

const makeSut = () => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub}
}

describe('EmailValidation', () => {

  it('should call Email validator with correct email', () => {
    const {sut, emailValidatorStub} = makeSut()
    const isValid = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: "any_email@mail.com"})
    expect(isValid).toHaveBeenCalledWith("any_email@mail.com")
  });

  it('shoudl throw if email validator throws', () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  });


});