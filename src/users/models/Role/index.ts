import mongoose from 'mongoose'

export interface Role {
  _id: mongoose.Types.ObjectId
  type: 'USER'
}

export const RoleSchema = new mongoose.Schema<Role>({
  type: {
    type: String,
    required: true,
    enum: ['USER'],
  },
})

export const Role = mongoose.model('roles', RoleSchema)
