/* eslint-disable @typescript-eslint/no-unused-vars */
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface BaseSchema<T = any> extends Base {}

export abstract class BaseSchema<T> extends TimeStamps {
  abstract get public(): Partial<T>
}
