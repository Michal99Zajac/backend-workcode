import { z } from 'zod'

import { PublicUser } from '../parsers/PublicUser'

export const Response = PublicUser.omit({ role: true }).array()

export type Response = z.infer<typeof Response>
