import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'

export interface Role extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'Roles',
  },
})
export class Role {
  @prop({
    type: () => String,
    required: true,
    unique: true,
    enum: ['USER', 'ADMIN'],
  })
  public value: string
}

export const RoleModel = getModelForClass(Role)

export default RoleModel
