import { modelOptions, prop, PropType, Ref, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'

import { BaseSchema } from '@root/types'
import { User } from '@users/schemas/User'

@plugin(autopopulate)
@modelOptions({
  schemaOptions: {
    collection: 'Workspaces',
    timestamps: true,
  },
})
export class Workspace extends BaseSchema {
  @prop({
    ref: () => User,
    required: true,
    immutable: true,
    autopopulate: true,
  })
  public author: Ref<User>

  @prop({
    type: () => String,
    required: [true, 'Name is required'],
    maxlength: [255, 'Name is too long'],
  })
  public name: string

  @prop({
    type: () => String,
    required: [true, 'Code type is required'],
    enum: ['BASH', 'JAVASCRIPT', 'PYTHON'],
  })
  public code: string

  @prop(
    {
      ref: () => User,
      default: [],
      autopopulate: true,
    },
    PropType.ARRAY
  )
  public contributors: Ref<User>[]

  // instance methods

  // virtuals
  public get public() {
    const author = this.author as User
    const contributors = (this.contributors as User[]).map((contributor) =>
      contributor.public ? contributor.public : contributor
    )

    return {
      _id: this._id,
      name: this.name,
      code: this.code,
      createdAt: this.createdAt,
      author: author.public ? author.public : author,
      contributors: contributors,
    }
  }

  // static functions
}

export default Workspace
