import { ModelOptions, pre, prop, Ref } from '@typegoose/typegoose'

import { Workspace } from '@workspaces/schemas'
import { User } from '@users/schemas'
import { BaseSchema } from '@root/types'

@ModelOptions({
  schemaOptions: {
    collection: 'Invitations',
    timestamps: true,
  },
})
@pre<Invitation>('save', function () {
  this.key = '#' + this.guest.toString() + this.workspace.toString()
})
export class Invitation extends BaseSchema {
  @prop({
    ref: () => User,
    required: true,
    immutable: true,
  })
  public guest: Ref<User>

  @prop({
    ref: () => Workspace,
    required: true,
    immutable: true,
  })
  public workspace: Ref<Workspace>

  @prop({
    type: () => String,
    unique: true,
  })
  public key: string

  // instance methods

  // virtuals
  public get public() {
    const workspace = this.workspace as Workspace
    const guest = this.guest as User

    return {
      _id: this._id,
      guest: guest.public ? guest.public : guest,
      workspace: workspace.public ? workspace.public : workspace,
      createdAt: this.createdAt,
    }
  }

  // static functions
}

export default Workspace
