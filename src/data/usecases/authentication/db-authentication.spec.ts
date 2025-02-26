import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

describe("DbAuhentication Use Case", () => {
  it("Should call LoadAccountByEmail Reposutory with correct email", async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        const accountModel: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'email@mail.com',
          password: 'any_password'
        }
        return new Promise(resolve => resolve(accountModel))
      }
    }
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    const sut = new DbAuthentication(loadAccountByEmailRepository);
    await sut.auth("email@mail.com", "123");

    expect(loadSpy).toHaveBeenCalledWith("email@mail.com");
  });
});
