const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/) 
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name, // Make it sticky
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please select a classification."),

    // make is required
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make (min. 3 chars)."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model (min. 3 chars)."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please provide a valid 4-digit year."),

    // description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    // price is required, must be numeric
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide valid miles."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Rebuild the classification list so the dropdown is sticky
    let classificationList = await utilities.buildClassificationList(classification_id)
    
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

module.exports = validate