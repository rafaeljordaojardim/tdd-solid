import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../erros";
import { serverError, unauthorized } from "../../helpers/http-helper";
import { EmailValidator } from "../signup/signup-protocols";
import { LoginController } from "./login";

const makeEmailValidatorStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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
  it('Should return 400 if no email is provided', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        password: '123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  });

  it('Should return 400 if no password is provided', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_mail@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  });

  it('Should call Email validator with correct param', async () => {
    const {sut, emailValidatorStub} = makeSut()
    const emailSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(emailSpy).toHaveBeenCalledWith(httpRequest.body.email)
  });

  it('Should return 400 if EmailValidator returns false', async () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => false)
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
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
});