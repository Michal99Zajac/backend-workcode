import { App } from './app'
import config from './config'

const { PORT, HOST } = config
;(async () => {
  const app = await App()

  app.listen(PORT, HOST, () => {
    console.log(`Application listen on http://${HOST}:${PORT}`)
  })
})()
