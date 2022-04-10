import { BasePropOptions } from '@typegoose/typegoose/lib/types'
import mongoose from 'mongoose'
import validator from 'validator'

import { RoleClass } from '../../Role'

export const props: Record<string, BasePropOptions> = {
  id: {
    type: () => String,
    unique: true,
    immutable: true,
  },
  name: {
    type: () => String,
    required: [true, 'Name is required'],
    maxlength: [255, 'Name is too long'],
  },
  lastname: {
    type: () => String,
    required: [true, 'Lastname is required'],
    maxlength: [255, 'Lastname is too long'],
  },
  email: {
    type: () => String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: (value) => `${value.value} is not an email`,
    },
  },
  src: {
    type: () => String,
    default: null,
  },
  password: {
    type: () => String,
    required: [true, 'Password is required'],
    validate: {
      validator: (password: string) => validator.isStrongPassword(password),
      message: 'Password is too weak',
    },
  },
  roles: {
    ref: () => RoleClass,
  },
}

export default props
