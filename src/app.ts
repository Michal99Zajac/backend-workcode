import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import passport from 'passport'

import './passport'
import { i18n } from './i18n'
import { corsOptions } from './cors'
import { connect } from './db'
import userRouter from './users/routes'
import { router as authRouter } from './auth/routes'
import { router as workspaceRouter } from './workspace/routes'
import { errorHandler, notFound } from './common/middlewares'

export const App = async (): Promise<express.Application> => {
  const app: express.Application = express()

  // connect to the mongo database
  await connect()

  // middlewares
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(i18n)
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(passport.initialize())

  // routers
  app.use('/api', authRouter, workspaceRouter, userRouter)

  // 404
  app.use('*', notFound)

  // Error
  app.use(errorHandler)

  return app
}

export default App
