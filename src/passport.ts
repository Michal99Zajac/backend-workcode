import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT, { ExtractJwt } from 'passport-jwt'
import i18next from 'i18next'
import bcrypt from 'bcrypt'

import { config } from './config'
import { User } from './users/models'

const JWTStrategy = passportJWT.Strategy
const LocalStrategy = passportLocal.Strategy
const { JWT_SECRET } = config

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      const user = await User.findOne({ email: email }).populate('role')

      try {
        if (!user) throw new Error(i18next.t('auth.incorrect.email'))

        const isCorrect = await bcrypt.compare(password, user.password)

        if (!isCorrect) throw new Error(i18next.t('auth.incorrect.password'))

        return done(null, user, { message: i18next.t('auth.signin.success') })
      } catch (error) {
        return done(error)
      }
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
