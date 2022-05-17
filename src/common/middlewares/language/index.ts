import i18n from 'i18next'
import { Request, Response, NextFunction } from 'express'

export const language = (req: Request, res: Response, next: NextFunction) => {
  i18n.changeLanguage(req.headers['accept-language'])

  next()
}

export default language
