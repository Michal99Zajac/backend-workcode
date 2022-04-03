import { ObjectId } from 'mongodb'
import { z } from 'zod'

export const Role = z.object({
  _id: z.instanceof(ObjectId),
  type: z.enum(['USER']),
})

export type Role = z.infer<typeof Role>
