import { z } from 'zod'

import { User, Role } from '../../models'

export const PublicUser = User.pick({
  name: true,
  lastname: true,
  src: true,
  email: true,
}).extend({
  role: Role.array().transform((roles) => roles.map((role) => role.type)),
  _id: Role.shape._id.transform((_id) => _id.toString()),
})

export type PublicUser = z.infer<typeof PublicUser>
