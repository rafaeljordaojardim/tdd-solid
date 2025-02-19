import { Controller, httpRequest, httpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

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

describe('', () => {
  it('Should call controller handle', async () => {
    const controllerStub = makeControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)

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

  it('Should return the same result as ', async () => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)

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
});