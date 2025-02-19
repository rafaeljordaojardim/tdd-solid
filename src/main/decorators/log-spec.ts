import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import { Controller, httpRequest, httpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

const makeLogStub = () => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
    
  }
  return new LogErrorRepositoryStub()
}

const makeControllerStub = () => {
  class ControllerStub implements Controller {
    handle(httpRequest: httpRequest): Promise<httpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          test: 1
        }
      }
      return new Promise((resolve) => resolve(httpResponse))
    }
    
  }
  return new ControllerStub()
}

const makeSut = () => {
  const controllerStub = makeControllerStub()
  const LogErrorRepositoryStub = makeLogStub()
  const sut = new LogControllerDecorator(controllerStub, LogErrorRepositoryStub)
  return {
    sut, 
    controllerStub,
    LogErrorRepositoryStub
  }
}

describe('', () => {
  it('Should call controller handle', async () => {
    const {sut, controllerStub} = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: '_any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  });

  it('Should return the same result as controller', async () => {
    const {sut} = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: '_any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        test: 1
      }
    })
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, LogErrorRepositoryStub, controllerStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    )
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: '_any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  });
});