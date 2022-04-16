import dotenv from 'dotenv'

// init dotenv config
dotenv.config()

// API configuration
export const config = {
  // APP
  PORT: Number(process.env['PORT']) || 8000,
  HOST: process.env['HOST'] || 'localhost',
  ALLOWED_HOST: process.env['ALLOWED_HOST'] || '*',
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PUBLIC_URL: process.env['PUBLIC_URL'] || 'http://localhost:3000',

  // MONGO
  MONGO_AUTH_DB: process.env['MONGO_AUTH_DB'] || 'admin',
  MONGO_PORT: process.env['MONGO_PORT'] || 27017,
  MONGO_HOST: process.env['MONGO_HOST'] || 'localhost',
  MONGO_USERNAME: process.env['MONGO_USERNAME'] || 'admin',
  MONGO_PASSWORD: process.env['MONGO_PASSWORD'] || 'password',
  MONGO_DB: process.env['MONGO_DB'] || 'workcode',
  MONGO_URL: '',

  // BCRYPT
  SALT_ROUNDS: process.env['SALT_ROUNDS'] || 10,

  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'secret',

  // SMTP
  SMTP_HOST: process.env['SMTP_HOST'] || 'localhost',
  SMTP_PORT: process.env['SMTP_PORT'] || 1025,
  SMTP_SECURE: process.env['SMTP_SECURE'] || false,
  SMTP_USER: process.env['SMTP_USER'] || undefined,
  SMTP_PASS: process.env['SMTP_PASS'] || undefined,
}

// calculated after declaration
config[
  'MONGO_URL'
] = `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`

export default config
