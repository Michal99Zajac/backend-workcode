import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT, { ExtractJwt } from 'passport-jwt'
import i18next from 'i18next'
import bcrypt from 'bcrypt'
import { Forbidden } from 'http-errors'

import { prettyError } from '@common/utils'
import { config } from '@config'
import { UserModel } from '@root/models'

const JWTStrategy = passportJWT.Strategy
const LocalStrategy = passportLocal.Strategy
const { JWT_SECRET } = config

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      // check email and get user
      const user = await UserModel.findOne({ email: email })
      if (!user) {
        return done({ email: i18next.t('passport.local.incorrect.email') })
      }

      // check password
      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) {
        return done({ password: i18next.t('passport.local.incorrect.password') })
      }

      return done(null, user, { message: i18next.t('passport.local.success') })
    }
  )
)

passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      const _id = payload._id as string

      const user = await UserModel.findOne({ _id: _id })

      if (user) return done(null, user)

      return done(new Forbidden(prettyError({ message: i18next.t('passport.jwt.unauthorized') })))
    }
  )
)
