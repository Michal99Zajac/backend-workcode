import {
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

import { Pagination, PaginationQuery } from '@common/types'
import { WorkspaceModel, UserModel } from '@root/models'
import { config } from '@config'
import { Role } from '@root/users/schemas/Role'
import { BaseSchema } from '@root/types'

const { SALT_ROUNDS } = config

@plugin(autopopulate)
@pre<User>('save', async function () {
  const hash = await bcrypt.hash(this.password, SALT_ROUNDS)
  this.password = hash
})
@pre<User>('deleteOne', async function (callback) {
  const filter = this.getFilter()

  try {
    const user = await UserModel.findOne(filter)
    await WorkspaceModel.deleteMany({ author: user._id })
  } catch (error) {
    callback(error)
  }
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
    const roles = (this.roles as Role[]).map((role) => (role.public ? role.public : role))

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
  public static async matchedFullname(this: ReturnModelType<typeof User>, fullname?: string) {
    if (!fullname) return undefined

    const regex = new RegExp(fullname, 'i')

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
            $regex: regex,
          },
        },
      },
    ]).then((owners) => owners.map((owner) => owner._id))
  }

  public static async findPagination(
    this: ReturnModelType<typeof User>,
    query: any,
    paginationQuery: PaginationQuery
  ): Promise<FindPagination> {
    const userQuery = this.find(query).getQuery()
    const count = await this.find(userQuery).countDocuments()
    const users = await this.find(userQuery)
      .skip(paginationQuery.page * paginationQuery.limit)
      .limit(paginationQuery.limit)
      .sort('name')
    // .transform((users) => users.map((user) => user.public))

    return {
      users: users,
      pagination: {
        first: 0,
        last: 0,
        next: 0,
        previous: 0,
        count: count,
      },
    }
  }
}

export default User

export interface FindPagination {
  users: User[]
  pagination: Pagination
}
