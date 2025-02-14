import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = () => {
  class EncrypterSub implements Encrypter {
    async encrypt(value: string): Promise<string> {
       return new Promise((resolve) => {
         return resolve('hashed_password')
       })
     }
   }
   return new EncrypterSub()
}

const makeSut = () => {
   const encrypterStub = makeEncrypter()
   const sut = new DbAddAccount(encrypterStub)
   return {
    encrypterStub,
    sut
   }
}

describe('DbAddAccount Usecase', () => {
  it('Shoul call encrypter with correct password', async () => {
    const {encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  });
});