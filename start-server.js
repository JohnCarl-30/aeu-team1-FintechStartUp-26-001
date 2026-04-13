import process from 'process'
import { app } from './server.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
