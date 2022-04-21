import {
  getModelForClass,
  modelOptions,
  DocumentType,
  pre,
  prop,
  PropType,
  Ref,
  plugin,
  ReturnModelType,
} from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import validator from 'validator'
import bcrypt from 'bcrypt'

import { config } from '@config'
import { Role } from '@users/models/Role'
import { BaseSchema } from '@root/types'

const { SALT_ROUNDS } = config

// export interface User extends Base {}

@plugin(autopopulate)
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
export class User extends BaseSchema {
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
      autopopulate: true,
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
    const roles = (this.roles as Role[]).map((role) => role.public)

    return {
      _id: this._id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
      roles: roles,
    }
  }

  // static functions
  public static async matchedFullname(
    this: ReturnModelType<typeof User>,
    fullname?: string
  ) {
    if (!fullname) return undefined

    return this.aggregate([
      {
        $addFields: {
          fullname: {
            $concat: ['$name', ' ', '$lastname'],
          },
        },
      },
      {
        $match: {
          fullname: {
            $regex: /e/,
            $options: 'i',
          },
        },
      },
    ]).then((owners) => owners.map((owner) => owner._id))
  }
}

export const UserModel = getModelForClass(User)

export default UserModel
