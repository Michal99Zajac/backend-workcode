import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { Role } from '../Role'

export const User = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  lastname: z.string(),
  src: z.string().nullish(),
  email: z.string().email(),
  role: Role.array(),
  password: z.string(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof User>
