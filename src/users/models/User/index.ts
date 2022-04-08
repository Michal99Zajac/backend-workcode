import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { z } from 'zod'
import { ObjectId } from 'mongodb'
import validator from 'validator'

import { Role } from '../Role'

export const User = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  lastname: z.string(),
  src: z.string().nullish(),
  email: z.string().email(),
  role: Role.array(),
  password: z.string(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof User>

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [255, 'Name is too long'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
    maxlength: [255, 'Lastname is too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: (value) => `${value.value} is not an email`,
    },
  },
  src: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: (password: string) => validator.isStrongPassword(password),
      message: 'Password is too weak',
    },
  },
  role: {
    type: [ObjectId],
    ref: 'roles',
  },
  updatedAt: {
    type: Date,
    required: true,
    default: dayjs().toDate(),
  },
})

// middlewares
UserSchema.pre('save', function (next) {
  this.updatedAt = dayjs().toDate()
  next()
})

export const UserModel = mongoose.model<User>('users', UserSchema)

export default UserModel
