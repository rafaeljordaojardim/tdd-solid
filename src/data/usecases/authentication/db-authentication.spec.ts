import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
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
  it("Should call LoadAccountByEmail Reposutory with correct email", async () => {
   const {sut, loadAccountByEmailRepository} = makeSut()
    
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth("email@mail.com", "123");

    expect(loadSpy).toHaveBeenCalledWith("email@mail.com");
  });

  it("Should throw LoadAccountByEmail Reposutory with correct email", async () => {
    const {sut, loadAccountByEmailRepository} = makeSut()
     
     const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
     await sut.auth("email@mail.com", "123");
 
     expect(loadSpy).toHaveBeenCalledWith("email@mail.com");
   });
});
