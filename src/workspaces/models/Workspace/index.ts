import {
  getModelForClass,
  modelOptions,
  prop,
  PropType,
  Ref,
} from '@typegoose/typegoose'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'

import { User } from '@users/models/User'

export interface Workspace extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'Workspaces',
    timestamps: true,
  },
})
export class Workspace extends TimeStamps {
  @prop({
    ref: () => User,
    required: true,
    immutable: true,
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
    },
    PropType.ARRAY
  )
  public contributors: Ref<User>[]

  // instance methods

  // virtuals
  public get public() {
    return {
      _id: this._id,
      name: this.name,
      code: this.code,
      createdAt: this.createdAt,
      author: this.author,
      contributors: this.contributors,
    }
  }

  // static functions
}

export const WorkspaceModel = getModelForClass<typeof Workspace>(Workspace)

export default WorkspaceModel
