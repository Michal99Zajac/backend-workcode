import mongoose from 'mongoose'

import { Role } from '../../schemas/Role'

export const RoleSchema = new mongoose.Schema<Role>({
  type: {
    type: String,
    required: true,
    enum: Role.shape.type.enum,
  },
})

export const RoleModel = mongoose.model('roles', RoleSchema)
