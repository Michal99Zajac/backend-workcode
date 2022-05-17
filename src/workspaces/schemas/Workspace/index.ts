import { modelOptions, prop, PropType, Ref, plugin, pre, post } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import i18n from 'i18next'

import { InvitationModel, WorkspaceModel, EditorModel } from '@root/models'
import { BaseSchema } from '@root/types'
import { User } from '@users/schemas/User'

@plugin(autopopulate)
@post<Workspace>('save', async function () {
  await new EditorModel({
    workspace: this._id,
  }).save()
})
@pre<Workspace>('deleteMany', async function (callback) {
  const filter = this.getFilter()

  try {
    const workspaceIds = await WorkspaceModel.find(filter).transform((workspaces) =>
      workspaces.map((workspace) => workspace._id)
    )

    await InvitationModel.deleteMany({
      workspace: {
        $in: workspaceIds,
      },
    })
  } catch (error) {
    callback(error)
  }
})
@pre<Workspace>('deleteOne', async function (callback) {
  const filter = this.getFilter()

  try {
    const workspace = await WorkspaceModel.findOne(filter)
    await InvitationModel.deleteMany({ workspace: workspace._id })
  } catch (error) {
    callback(error)
  }
})
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
    required: [true, i18n.t('workspaces.schemas.Workspace.index.name_required')],
    maxlength: [255, i18n.t('workspaces.schemas.Workspace.index.name_maxlength')],
  })
  public name: string

  @prop({
    type: () => String,
    required: [true, i18n.t('workspaces.schemas.Workspace.index.code_required')],
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
