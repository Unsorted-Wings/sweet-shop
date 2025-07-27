import { createApp } from './app.js'

const app = createApp()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🍰 Sweet Shop Backend Server running on port ${PORT}`)
  console.log(`📡 API available at: http://localhost:${PORT}/api`)
  console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/login`)
  console.log(`🍭 Sweet endpoints: /api/sweets`)
})
