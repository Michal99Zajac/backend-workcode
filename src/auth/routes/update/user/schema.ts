import { z } from 'zod'

import { PublicUser } from '../../../../common/schemas/PublicUser'

export const RequestBody = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  lastname: z.string().optional(),
})

export const Response = PublicUser.pick({
  name: true,
  lastname: true,
  email: true,
})

export type RequestBody = z.infer<typeof RequestBody>

export type Response = z.infer<typeof Response>
