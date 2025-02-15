import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () =>({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))
const salt = 12
const makeSut = () => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  });

  it('Should return a hash on succes', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  });

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  });
});