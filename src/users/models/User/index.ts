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
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'

import { config } from '../../../config'
import { RoleClass } from '../Role'

const { SALT_ROUNDS } = config

@pre<UserClass>('save', async function () {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS)
  this.id = v4()
  this.password = hash
})
@modelOptions({
  schemaOptions: {
    collection: 'Users',
    timestamps: true,
  },
})
export class UserClass {
  @prop({
    type: () => String,
    unique: true,
    immutable: true,
  })
  public id: string

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
      ref: () => RoleClass,
    },
    PropType.ARRAY
  )
  public roles: Ref<RoleClass>[]

  // instance methods
  public async checkPassword(this: DocumentType<UserClass>, password: string) {
    return bcrypt.compare(password, this.password)
  }

  // virtuals
  public get public() {
    return {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
    }
  }

  public get publicWithRoles() {
    return {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
      roles: this.roles.map((role: RoleClass) =>
        role.value ? role.value : role
      ),
    }
  }

  // static functions
}

export const User = getModelForClass(UserClass)

export default User
