import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

export const Role = z.object({
  _id: z.instanceof(ObjectId),
  type: z.enum(['USER']),
})

export const RoleSchema = new mongoose.Schema<Role>({
  type: {
    type: String,
    required: true,
    enum: Role.shape.type.enum,
  },
})

export type Role = z.infer<typeof Role>

export const RoleModel = mongoose.model('roles', RoleSchema)
