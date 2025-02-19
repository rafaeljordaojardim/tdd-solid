import { MissingParamError } from "../../erros";
import { LoginController } from "./login";


const makeSut = () => {
  const sut = new LoginController()

  return {
    sut
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

});