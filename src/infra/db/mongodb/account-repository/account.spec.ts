import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

describe('Account Mongo Repository', () => {
  beforeAll(async()=>{
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  
  afterAll(async()=>{
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'test',
      email: 'test@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('test')
    expect(account.email).toBe('test@mail.com')
    expect(account.password).toBe('any_password')
  });
});