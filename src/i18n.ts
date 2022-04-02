import i18next from 'i18next'
import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    debug: false,
    preload: ['en', 'pl'],
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/../locales/{{lng}}/{{ns}}.missing.json',
    },
    saveMissing: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl'],
  })

export const i18n = middleware.handle(i18next)

export default i18n
