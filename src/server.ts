import express from 'express'

const app = express()
const PORT = 8080

app.get('/', (req, res) => {
  res.json({
    hello: 'Hello World!',
  })
})

app.listen(PORT, () => {
  console.log(`Application listen on http://localhost:${PORT}`)
})
