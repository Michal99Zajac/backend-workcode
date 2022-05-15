import { modelOptions, prop, Ref, plugin, ReturnModelType } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { ObjectID } from 'bson'

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
  public static async contentRefresh(
    this: ReturnModelType<typeof Editor>,
    editorId: ObjectID,
    content: string
  ) {
    await this.updateOne({ _id: editorId }, { content: content })
  }
}

export default Editor
