const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* **********************************
 * Favorite Data Validation Rules
 * ********************************* */
validate.favoriteRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid inventory id."),
  ]
}

/* ******************************
 * Check favorite data and return errors or continue
 * ***************************** */
validate.checkFavoriteData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please provide a valid vehicle.")
    // Best effort: go back to where they came from.
    const backURL = req.get("Referrer") || "/"
    return res.redirect(backURL)
  }
  next()
}

module.exports = validate
