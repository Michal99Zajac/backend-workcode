import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

import { i18n } from './i18n'
import { corsOptions } from './cors'
import { connect } from './db'
import { router as authRouter } from './auth/routes'
import { router as workspaceRouter } from './workspace/routes'

export const App = async (): Promise<express.Application> => {
  const app: express.Application = express()

  // connect to the mongo database
  await connect()

  // middlewares
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(i18n)

  // routers
  app.use('/api', authRouter, workspaceRouter)

  return app
}

export default App
