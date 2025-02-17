import { AccountModel } from "../../../domain/models/account";
import { AddAccountModel } from "../../../domain/usecases/add-account";
import { AddAccountRepository } from "../../protocols/add-account-repository";
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
const fakeAccount: AccountModel = {
  id: '123',
  name: 'test',
  email: 'test@test.com',
  password: '1243'
};
const makeAddAccountRepo = () => {
  class DbAddAccountRepo implements AddAccountRepository {
   async add(accountData: AddAccountModel): Promise<AccountModel> {
      return fakeAccount
    }
    
   }
   return new DbAddAccountRepo()
}

const makeSut = () => {
   const encrypterStub = makeEncrypter()
   const addAccountRepo = makeAddAccountRepo()
   const sut = new DbAddAccount(encrypterStub, addAccountRepo)
   return {
    encrypterStub,
    sut
   }
}

describe('DbAddAccount Usecase', () => {
  it('Should call encrypter with correct password', async () => {
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

  it('Should throw if encrypter throws', async () => {
    const {encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  });
});