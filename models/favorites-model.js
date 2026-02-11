const pool = require("../database/")

/* *****************************
 * Add a favorite (account_id + inv_id)
 * ***************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING *
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Remove a favorite
 * ***************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *`
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Check if an inventory item is favorited by an account
 * ***************************** */
async function checkFavorite(account_id, inv_id) {
  try {
    const sql = `SELECT favorite_id FROM public.favorites WHERE account_id = $1 AND inv_id = $2`
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Get all favorites for an account (joined to inventory)
 * ***************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id,
             i.inv_id,
             i.inv_make,
             i.inv_model,
             i.inv_year,
             i.inv_thumbnail,
             i.inv_price
      FROM public.favorites f
      JOIN public.inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.favorite_id DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesByAccountId,
}
