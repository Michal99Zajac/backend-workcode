import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose'

import { RoleClass } from '../Role'

import { props } from './props'
import { save } from './hooks'

@pre('save', save)
@modelOptions({
  schemaOptions: {
    collection: 'Users',
    timestamps: true,
  },
})
export class UserClass {
  @prop(props['id'])
  public id: string

  @prop(props['name'])
  public name: string

  @prop(props['lastname'])
  public lastname: string

  @prop(props['email'])
  public email: string

  @prop(props['src'])
  public src: string

  @prop(props['password'])
  public password: string

  @prop(props['roles'])
  public roles: Ref<RoleClass>[]

  // virtuals
  public get public() {
    return {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
    }
  }

  public get publicWithRoles() {
    return {
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      src: this.src,
      email: this.email,
      roles: this.roles,
    }
  }
}

export const User = getModelForClass(UserClass)

export default User
