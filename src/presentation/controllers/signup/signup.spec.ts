import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "./signup-protocols";
import { InvalidParamError, MissingParamError, ServerError} from "../../erros/";
import { SignUpController } from "./signup";
class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password',
      }
      return new Promise((resolve) => {
        return resolve(fakeAccount)
      })
    }
  }
  return new AddAccountStub()
}
const makeSut = () => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub}
}

describe('Signup controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  });

  it('Should return 400 if no email is provided', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
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
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  });

  it('Should return 400 if no password confirmation is provided', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  });

  it('should return 400 if an email is not passed correctly', async () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  });

  it('should return 400 if an password is not equal passwordConfirmation', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'invalid_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  });

  it('should call email validator with correct param', async () => {
    const {sut, emailValidatorStub} = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  });

  it('should call AddAccount with correct values', async () => {
    const {sut, addAccountStub} = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pasword',
      })
  });
  
  

  it('should return 500 if email validator throws', async () => {
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(""))
  });

  it('should return 500 if addAccount throws', async () => {
    const {sut, addAccountStub} = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pasword',
        passwordConfirmation: 'any_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(""))
  });

  it('should return 200 if request complete with success', async () => {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_pasword',
        passwordConfirmation: 'valid_pasword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    })
  });
});