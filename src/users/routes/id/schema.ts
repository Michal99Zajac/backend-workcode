import { z } from 'zod'

import { PublicUser } from '../../parsers'

export const Response = PublicUser.omit({ role: true })

export type Response = z.infer<typeof Response>
