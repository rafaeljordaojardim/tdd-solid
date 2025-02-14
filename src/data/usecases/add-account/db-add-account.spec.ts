import { DbAddAccount } from "./db-add-account";

describe('DbAddAccount Usecase', () => {
  it('Shoul call encrypter with correct password', async () => {

    class EncrypterSub {
     async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => {
          return resolve('hashed_password')
        })
      }
    }
    const encrypterStub = new EncrypterSub()
    const sut = new DbAddAccount(encrypterStub)
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