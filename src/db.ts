import mongoose, { Mongoose } from 'mongoose'

import { config } from '@config'

const { MONGO_URL, MONGO_PASSWORD, MONGO_USERNAME, MONGO_AUTH_DB } = config

let db: Mongoose

export const connect = async () => {
  db = await mongoose.connect(MONGO_URL, {
    authSource: MONGO_AUTH_DB,
    auth: {
      username: MONGO_USERNAME,
      password: MONGO_PASSWORD,
    },
  })

  return db
}

export default db
