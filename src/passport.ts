import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT, { ExtractJwt } from 'passport-jwt'
import i18next from 'i18next'
import bcrypt from 'bcrypt'

import { config } from './config'
import { User } from './users/models'
import { WorkcodeErrors } from './types'

const JWTStrategy = passportJWT.Strategy
const LocalStrategy = passportLocal.Strategy
const { JWT_SECRET } = config

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      // check email and get user
      const user = await User.findOne({ email: email }).populate('roles')
      if (!user) {
        const errors: WorkcodeErrors = [
          { key: 'email', message: i18next.t('auth.incorrect.email') },
        ]
        return done(errors)
      }

      // check password
      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) {
        const errors: WorkcodeErrors = [
          { key: 'password', message: i18next.t('auth.incorrect.password') },
        ]
        return done(errors)
      }

      return done(null, user, { message: i18next.t('auth.signin.success') })
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
      const id = payload as any
      const user = await User.findOne({ _id: id }).populate('role')

      if (user) return done(null, user)

      return done(new Error(i18next.t('auth.jwt.unauthorized')))
    }
  )
)
