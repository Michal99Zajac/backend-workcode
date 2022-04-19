import { IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types'
import { Document } from 'mongoose'

import { Workspace } from '@workspaces/models'

export type WorkcodeError = {
  key: string
  message: string
}

export type WorkcodeErrors = WorkcodeError[]

export type Query = Document<any, any, any> &
  Workspace &
  IObjectWithTypegooseFunction & {
    _id: any
  }
