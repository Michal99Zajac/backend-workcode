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
import i18n from 'i18next'

import { paginater } from '@common/utils'
import { PaginationQuery } from '@common/types'
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
    required: [true, i18n.t('users.schemas.User.index.name_required')],
    maxlength: [255, i18n.t('users.schemas.User.index.name_maxlength')],
  })
  public name: string

  @prop({
    type: () => String,
    required: [true, i18n.t('users.schemas.User.index.lastname_required')],
    maxlength: [255, i18n.t('users.schemas.User.index.lastname_maxlength')],
  })
  public lastname: string

  @prop({
    type: () => String,
    required: [true, i18n.t('users.schemas.User.index.email_required')],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: (value) => i18n.t('users.schemas.User.index.email_validate', { value: value }),
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
    required: [true, i18n.t('users.schemas.User.index.password_required')],
    validate: {
      validator: (password: string) => validator.isLength(password, { min: 8 }),
      message: i18n.t('users.schemas.User.index.password_validate'),
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
  ) {
    const userQuery = this.find(query).getQuery()
    const count = await this.find(userQuery).countDocuments()
    const users = await this.find(userQuery)
      .skip(paginationQuery.page * paginationQuery.limit)
      .limit(paginationQuery.limit)
      .sort('name')

    return {
      users: users,
      pagination: paginater({ count, limit: paginationQuery.limit, page: paginationQuery.page }),
    }
  }
}

export default User
