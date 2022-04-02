import dotenv from 'dotenv'

// init dotenv config
dotenv.config()

// APP
const PORT = Number(process.env['PORT']) || 8000
const HOST = process.env['HOST'] || 'localhost'
const ALLOWED_HOST = process.env['ALLOWED_HOST'] || '*'

// MONGO
const MONGO_AUTH_DB = process.env['MONGO_AUTH_DB'] || 'admin'
const MONGO_PORT = process.env['MONGO_PORT'] || 27017
const MONGO_HOST = process.env['MONGO_HOST'] || 'localhost'
const MONGO_USERNAME = process.env['MONGO_USERNAME'] || 'admin'
const MONGO_PASSWORD = process.env['MONGO_PASSWORD'] || 'password'
const MONGO_DB = process.env['MONGO_DB'] || 'workcode'

// API configuration
export const config = {
  HOST,
  PORT,
  ALLOWED_HOST,
  MONGO_URL: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_AUTH_DB,
}

export default config
