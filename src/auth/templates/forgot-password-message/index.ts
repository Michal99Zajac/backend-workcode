import i18n from 'i18next'

import { config } from '@config'

const { PUBLIC_URL } = config

interface Message {
  token: string
}

export const forgotPasswordMessage = (message: Message) => {
  return `
    <h1>Worckode</h1>
    <h4>${i18n.t('auth.templates.forgot_password_message.index.title')}:</h4>
    <p>
      <a
        href="${PUBLIC_URL}/auth/change-password/${message.token}"
      >
        ${i18n.t('auth.templates.forgot_password_message.index.message')}
      </a>
    </p>
  `
}

export default forgotPasswordMessage
