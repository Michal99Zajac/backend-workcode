/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  getModelForClass,
  modelOptions,
  DocumentType,
  pre,
  prop,
  PropType,
  Ref,
} from '@typegoose/typegoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'

import { config } from '@config'
import { Role } from '@users/models/Role'

const { SALT_ROUNDS } = config

export interface User extends Base {}

@pre<User>('save', async function () {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS)
  this.password = hash
})
@modelOptions({
  schemaOptions: {
    collection: 'Users',
    timestamps: true,
  },
})
export class User extends TimeStamps {
  @prop({
    type: () => String,
    required: [true, 'Name is required'],
    maxlength: [255, 'Name is too long'],
  })
  public name: string

  @prop({
    type: () => String,
    required: [true, 'Lastname is required'],
    maxlength: [255, 'Lastname is too long'],
  })
  public lastname: string

  @prop({
    type: () => String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: (value) => `${value.value} is not an email`,
    },
  })
  public email: string

  @prop({
    type: () => String,
    default: null,
  })
  public src: string

  @prop({
    type: () => String,
    required: [true, 'Password is required'],
    validate: {
      validator: (password: string) => validator.isStrongPassword(password),
      message: 'Password is too weak',
    },
  })
  public password: string

  @prop(
    {
      ref: () => Role,
    },
    PropType.ARRAY
  )
  public roles: Ref<Role>[]

  // instance methods
  public async checkPassword(this: DocumentType<User>, password: string) {
    return bcrypt.compare(password, this.password)
  }

  // virtuals
  public get public() {
    return {
      _id: this._id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
    }
  }

  public get publicWithRoles() {
    return {
      _id: this._id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
      roles: this.roles.map((role: Role) => (role.value ? role.value : role)),
    }
  }

  // static functions
}

export const UserModel = getModelForClass(User)

export default UserModel
