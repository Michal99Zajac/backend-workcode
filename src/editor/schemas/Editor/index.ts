import { modelOptions, prop, Ref, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'

import { Workspace } from '@workspaces/schemas'
import { BaseSchema } from '@root/types'

@plugin(autopopulate)
@modelOptions({
  schemaOptions: {
    collection: 'Editors',
    timestamps: true,
  },
})
export class Editor extends BaseSchema {
  @prop({
    type: () => String,
    default: '',
  })
  public content: string

  @prop({
    ref: () => Workspace,
    autopopulate: true,
  })
  public workspace: Ref<Workspace>

  // instance methods

  // virtuals
  public get public() {
    const workspace = this.workspace as Workspace

    return {
      _id: this._id,
      content: this.content,
      workspace: workspace.public,
    }
  }

  // static functions
}

export default Editor
