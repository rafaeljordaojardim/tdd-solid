import { MongoHelper } from "../mongodb/helpers/mongo-helper";
import { LogMongoRepository } from "./log";

describe('Log Mongo Repository', () => {
  let errorCollection;
   beforeAll(async()=>{
      await MongoHelper.connect(process.env.MONGO_URL)
    })
    
    afterAll(async()=>{
      await MongoHelper.disconnect()
    })
  
    beforeEach(async () => {
     errorCollection = await MongoHelper.getCollection('errors')
      await errorCollection.deleteMany({})
    })
  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  });
});