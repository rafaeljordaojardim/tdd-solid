import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = () => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository);

  return { sut, loadAccountByEmailRepository}
}

describe("DbAuhentication Use Case", () => {
  it("Should call LoadAccountByEmail Repository with correct email", async () => {
   const {sut, loadAccountByEmailRepository} = makeSut()
    
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth("email@mail.com", "123");

    expect(loadSpy).toHaveBeenCalledWith("email@mail.com");
  });

  it("Should throw LoadAccountByEmail Repository throws", async () => {
    const {sut, loadAccountByEmailRepository} = makeSut()
     
     jest.spyOn(loadAccountByEmailRepository, 'load').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
     })
     const promise = sut.auth("email@mail.com", "123");
 
     expect(promise).rejects.toThrow()
   });
});
