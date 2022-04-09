import mongoose from 'mongoose'
import dayjs from 'dayjs'
// import { z } from 'zod'
import { ObjectId } from 'mongodb'
import validator from 'validator'

import { Role } from '../Role'

export interface User {
  _id: mongoose.Types.ObjectId
  name: string
  lastname: string
  src: string | null | undefined
  email: string
  role: Role
  password: string
  updatedAt: Date
}

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

// virtuals
UserSchema.virtual('public').get(function (this: User) {
  return {
    id: this._id,
    lastname: this.lastname,
    name: this.lastname,
    email: this.email,
    src: this.src,
  }
})

export const User = mongoose.model<User>('users', UserSchema)

export default User
