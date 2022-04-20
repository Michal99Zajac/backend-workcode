import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

import { BaseSchema } from '@root/types'

@modelOptions({
  schemaOptions: {
    collection: 'Roles',
  },
})
export class Role extends BaseSchema<string> {
  @prop({
    type: () => String,
    required: true,
    unique: true,
    enum: ['USER', 'ADMIN'],
  })
  public value: string

  public get public() {
    return this.value
  }
}

export const RoleModel = getModelForClass(Role)

export default RoleModel
