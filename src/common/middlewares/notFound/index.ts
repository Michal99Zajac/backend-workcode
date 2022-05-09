import { Request, Response, NextFunction } from 'express'
import { NotFound } from 'http-errors'

import { prettyError } from '@common/utils'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFound(prettyError({ message: req.t('error.not_found') })))
}

export default notFound
