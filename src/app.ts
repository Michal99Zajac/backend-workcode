import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import passport from 'passport'
import morgan from 'morgan'
import http from 'http'
import { Server } from 'socket.io'

import userRouter from '@users/routes'
import { router as authRouter } from '@auth/routes'
import { router as workspaceRouter } from '@workspaces/routes'
import { router as editorRouter } from '@editor/routers'
import { errorHandler, notFound, language } from '@common/middlewares'
import { initEditor } from '@editor/connection'
import { initChat } from '@chat/connection'

import { create as createMailer } from './mailer'
import { connect } from './db'
import { corsOptions } from './cors'
import { i18n } from './i18n'
import './passport'

export const App = async () => {
  const app: express.Application = express()
  const server = http.createServer(app)

  // connect to the mongo database
  await connect()

  // socket configuration
  const socket = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  // editor socket configuration
  initEditor(socket)

  // chat configutation
  initChat(socket)

  // create SMTP transporter
  createMailer()

  // middlewares
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(i18n)
  app.use(language)
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(passport.initialize())
  app.use(morgan('combined'))

  // routers
  app.use('/api', authRouter, workspaceRouter, userRouter, editorRouter)

  // 404
  app.use('*', notFound)

  // Error
  app.use(errorHandler)

  return server
}

export default App
