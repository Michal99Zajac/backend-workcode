import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { BadRequest } from 'http-errors'

import { prettyError } from '@common/utils'
import { UserModel } from '@root/models'
import { config } from '@config'
import { mailer } from '@root/mailer'
import { forgotPasswordMessage } from '@auth/templates'

const { JWT_SECRET } = config

export const router = Router()

router.post('/auth/forgot-password', async (req, res, next) => {
  const email = req.body.email
  const user = await UserModel.findOne({ email: email })

  if (!user)
    return next(
      new BadRequest(prettyError({ email: req.t('auth.routes.forgot_password.index.post.email') }))
    )

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15m' })

  try {
    await mailer.sendMail({
      from: 'workcode@example.com', // TODO: change to the dedicated email
      to: user.email,
      subject: req.t('auth.routes.forgot_password.index.post.subject'),
      html: forgotPasswordMessage({ token }),
    })
  } catch (error) {
    next(new BadRequest(prettyError({ error: error })))
  }

  res.status(200).json({
    message: req.t('auth.routes.forgot_password.index.post.success'),
  })
})

export default router
