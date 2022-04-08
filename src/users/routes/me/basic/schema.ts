import { z } from 'zod'

import { PublicUser } from '../../../parsers'

export const Body = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  lastname: z.string().optional(),
})

export const Response = PublicUser.omit({ role: true })

export type Body = z.infer<typeof Body>

export type Response = z.infer<typeof Response>
