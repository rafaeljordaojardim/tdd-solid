import { AccountModel } from "../../../domain/models/account";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = () => ({
  id: "any_id",
  name: "any_name",
  email: "email@mail.com",
  password: "hash_password",
});

const makeLoadAccountByEmailRepository = () => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeHashCompare = () => {
  class HashCompareStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new HashCompareStub();
};

const makeTokenGenerator = () => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'));
    }
  }

  return new TokenGeneratorStub();
};

const makeSut = () => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepository,
    hashCompareStub,
    tokenGeneratorStub
  );

  return { sut, loadAccountByEmailRepository, hashCompareStub, tokenGeneratorStub };
};

describe("DbAuhentication Use Case", () => {
  it("Should call LoadAccountByEmail Repository with correct email", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, "load");
    await sut.auth("email@mail.com", "any_password");

    expect(loadSpy).toHaveBeenCalledWith("email@mail.com");
  });

  it("Should throw LoadAccountByEmail Repository throws", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepository, "load")
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const promise = sut.auth("email@mail.com", "any_password");

    expect(promise).rejects.toThrow();
  });

  it("Should return null if repository returns null", async () => {
    const { sut, loadAccountByEmailRepository } = makeSut();

    jest.spyOn(loadAccountByEmailRepository, "load").mockReturnValueOnce(null);
    const accessToken = await sut.auth("email@mail.com", "any_password");

    expect(accessToken).toBeNull();
  });

  it("Should call compare with correct values", async () => {
    const { sut, hashCompareStub } = makeSut();

    const compareSpy = jest.spyOn(hashCompareStub, "compare");
    await sut.auth("email@mail.com", "any_password");

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hash_password");
  });

  it("Should return null if hashComparer returns false", async () => {
    const { sut, hashCompareStub } = makeSut();

    jest.spyOn(hashCompareStub, "compare").mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const accessToken = await sut.auth("email@mail.com", "any_password");

    expect(accessToken).toBeNull();
  });

  it("Should throw HashCompare throws", async () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, "compare")
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const promise = sut.auth("email@mail.com", "any_password");

    expect(promise).rejects.toThrow();
  });

  it("Should token generator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");
    await sut.auth("email@mail.com", "any_password");

    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  it("Should throw TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const promise = sut.auth("email@mail.com", "any_password");

    expect(promise).rejects.toThrow();
  });

  it("Should return access token", async () => {
    const { sut } = makeSut();

   const accessToken = await sut.auth("email@mail.com", "any_password");

    expect(accessToken).toBe("any_token");
  });
});
