import { Request, Response, NextFunction } from 'express'
import { NotFound } from 'http-errors'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFound(req.t('error.not_found')))
}

export default notFound
