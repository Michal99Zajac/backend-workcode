/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'http-errors'

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message })
}

export default errorHandler
