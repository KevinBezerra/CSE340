const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
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

// Export the wrapper for BOTH environments
// This ensures you see "error in query" in your Render logs
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      // console.log("executed query", { text }) // Uncomment to see all queries in logs
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}