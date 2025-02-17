import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
.then(async () => {
    console.log(`Connected to database`);
    const app = (await import("./config/app")).default
    app.listen(env.port, () => console.log("server Running"))
  })
  .catch((err) => console.log(err))