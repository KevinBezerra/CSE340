const { Pool } = require("pg")
require("dotenv").config()

let pool

if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
} else {
  // PRODUCTION ENVIRONMENT
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

// WRAPPER: This ensures we see errors in the Render logs!
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      return res
    } catch (error) {
      // THIS is the message you are looking for in the logs
      console.error("error in query", { text })
      throw error
    }
  },
}