import { DocumentType } from '@typegoose/typegoose'
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'

import { config } from '../../../../config'

import { UserClass } from '../index'

const { SALT_ROUNDS } = config

export async function save(this: DocumentType<UserClass>) {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS)

  this.id = v4()
  this.password = hash
}
