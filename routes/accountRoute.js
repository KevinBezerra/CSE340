// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const favValidate = require('../utilities/favorites-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Favorites (Final Enhancement)
router.get("/favorites", utilities.checkLogin, utilities.handleErrors(accountController.buildFavorites))
router.post(
  "/favorites/add",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(accountController.addFavorite)
)
router.post(
  "/favorites/remove",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(accountController.removeFavorite)
)

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to build the "Update Account" view
router.get("/update/:accountId", utilities.handleErrors(accountController.buildAccountUpdate))

// Process the Account Update
router.post(
  "/update", 
  regValidate.updateAccountRules(), 
  regValidate.checkUpdateData, 
  utilities.handleErrors(accountController.updateAccount)
)

// Process the Password Change
router.post(
  "/change-password", 
  regValidate.changePasswordRules(), 
  regValidate.checkPasswordData, 
  utilities.handleErrors(accountController.changePassword)
)

module.exports = router;