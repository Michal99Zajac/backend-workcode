import bcrypt from 'bcrypt'
import validator from 'validator'

import { config } from '@config'

const { SALT_ROUNDS } = config

export const encryptPassword = (password: string | undefined): string | undefined => {
  if (!password) return undefined

  if (!validator.isStrongPassword(password)) throw { password: 'password is too weak' }

  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export default encryptPassword
