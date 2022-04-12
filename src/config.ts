import dotenv from 'dotenv'

// init dotenv config
dotenv.config()

// APP
const PORT = Number(process.env['PORT']) || 8000
const HOST = process.env['HOST'] || 'localhost'
const ALLOWED_HOST = process.env['ALLOWED_HOST'] || '*'
const NODE_ENV = process.env['NODE_ENV'] || 'development'
const PUBLIC_URL = process.env['PUBLIC_URL'] || 'http://localhost:3000'

// MONGO
const MONGO_AUTH_DB = process.env['MONGO_AUTH_DB'] || 'admin'
const MONGO_PORT = process.env['MONGO_PORT'] || 27017
const MONGO_HOST = process.env['MONGO_HOST'] || 'localhost'
const MONGO_USERNAME = process.env['MONGO_USERNAME'] || 'admin'
const MONGO_PASSWORD = process.env['MONGO_PASSWORD'] || 'password'
const MONGO_DB = process.env['MONGO_DB'] || 'workcode'
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

// BCRYPT
const SALT_ROUNDS = process.env['SALT_ROUNDS'] || 10

// JWT
const JWT_SECRET = process.env['JWT_SECRET'] || 'secret'

// SMTP
const SMTP_HOST = process.env['SMTP_HOST'] || 'localhost'
const SMTP_PORT = process.env['SMTP_PORT'] || 1025
const SMTP_SECURE = process.env['SMTP_SECURE'] || false
const SMTP_USER = process.env['SMTP_USER'] || undefined
const SMTP_PASS = process.env['SMTP_PASS'] || undefined

// API configuration
export const config = {
  HOST,
  PORT,
  ALLOWED_HOST,
  NODE_ENV,
  MONGO_URL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_AUTH_DB,
  SALT_ROUNDS,
  JWT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  PUBLIC_URL,
}

export default config
