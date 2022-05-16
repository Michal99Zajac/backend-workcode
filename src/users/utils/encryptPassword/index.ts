import bcrypt from 'bcrypt'
import validator from 'validator'
import i18n from 'i18next'

import { config } from '@config'

const { SALT_ROUNDS } = config

export const encryptPassword = (password: string | undefined): string | undefined => {
  if (!password) return undefined

  if (!validator.isStrongPassword(password))
    throw { password: i18n.t('users.utils.encryptPassword.index.password') }

  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export default encryptPassword
