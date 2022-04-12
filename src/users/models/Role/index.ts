import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'Roles',
  },
})
export class RoleClass {
  @prop({
    type: () => String,
    required: true,
    unique: true,
    enum: ['USER', 'ADMIN'],
  })
  public value: string
}

export const Role = getModelForClass(RoleClass)
