import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  PropType,
  Ref,
} from '@typegoose/typegoose'
import { v4 } from 'uuid'

import { UserClass } from '@users/models/User'

@pre<Workspace>('save', async function () {
  this.id = v4()
})
@modelOptions({
  schemaOptions: {
    collection: 'Workspaces',
    timestamps: true,
  },
})
export class Workspace {
  @prop({
    type: () => String,
    unique: true,
    immutable: true,
  })
  public id: string

  @prop({
    ref: () => UserClass,
    required: true,
    immutable: true,
  })
  public author: Ref<UserClass>

  @prop({
    type: () => String,
    required: [true, 'Name is required'],
    maxlength: [255, 'Name is too long'],
  })
  public name: string

  @prop({
    type: () => String,
    required: [true, 'Code type is required'],
    enum: [['BASH', 'JAVASCRIPT', 'PYTHON'], 'Type of code is not allowed'],
  })
  public code: string

  @prop(
    {
      ref: () => UserClass,
      default: [],
    },
    PropType.ARRAY
  )
  public contributors: Ref<UserClass>[]

  // instance methods

  // virtuals

  // static functions
}

export const WorkspaceModel = getModelForClass(Workspace)

export default WorkspaceModel
