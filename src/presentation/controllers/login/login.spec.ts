import { InvalidParamError, MissingParamError } from "../../erros";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helper";
import { EmailValidator, Authentication } from "./login-protocols";
import { LoginController } from "./login";
import { Validation } from "../signup/signup-protocols";

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
   validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthenticationStub = () => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token'
    }
    
  }

  return new AuthenticationStub()
}

const makeSut = () => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeFakeHttpRequest = () => {
  return {
    body: {
      email: 'valid-mail@mail.com',
      password: '123456'
    }
  }
}
describe('Login Controller',  () => {
  it('Should return 500 if Authentication throws', async () => {
    const {sut, authenticationStub} = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  });

  it('Should call Authentication with correct values', async () => {
    const {sut, authenticationStub} = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  });

  it('Should return 401 if invalid credentials are provided', async () => {
    const {sut, authenticationStub} = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      return null
    })
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  });

  it('Should return 200 if valid credentials are provided', async () => {
    const {sut} = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  });

  it('should call Validation with correct value', async () => {
    const {sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  });

  it('should return 400 if validation returns an error', async () => {
    const {sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_pasword',
        passwordConfirmation: 'valid_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  });
});