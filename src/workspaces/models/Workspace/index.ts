import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  PropType,
  Ref,
} from '@typegoose/typegoose'
import { v4 } from 'uuid'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

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
export class Workspace extends TimeStamps {
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
    enum: ['BASH', 'JAVASCRIPT', 'PYTHON'],
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
  public get public() {
    return {
      id: this.id,
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
