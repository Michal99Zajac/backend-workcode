import { CorsOptions } from 'cors'

import { config } from '@config'

const { ALLOWED_HOST } = config

export const corsOptions: CorsOptions = {
  origin: ALLOWED_HOST,
}

export default corsOptions
