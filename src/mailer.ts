/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'

import { config } from '@config'

const { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER, NODE_ENV } = config

export let mailer: Transporter<SentMessageInfo> | undefined = undefined

export const create = (user?: string, password?: string) => {
  if (NODE_ENV === 'development') {
    mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
    } as any)
  } else {
    // TODO: implement production email sender
    mailer = undefined
  }
}

export default mailer
