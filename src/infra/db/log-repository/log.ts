import { LogErrorRepository } from "../../../data/protocols/db/log-error-repository";
import { MongoHelper } from "../mongodb/helpers/mongo-helper";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    
    await errorCollection.insertOne({
      stack,
      date: new Error()
    })
  }
  
}