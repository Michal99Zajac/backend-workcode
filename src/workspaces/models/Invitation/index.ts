import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose'

import { Workspace } from '@workspaces/models'
import { User } from '@users/models'
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
    return {
      _id: this._id,
      guest: this.guest,
      workspace: this.workspace,
      createdAt: this.createdAt,
    }
  }

  // static functions
}

export const InvitationModel = getModelForClass<typeof Invitation>(Invitation)

export default InvitationModel
