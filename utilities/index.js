const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail view HTML (REQUIRED FOR ASSIGNMENT 3)
* ************************************ */
Util.buildInventoryDetail = function (vehicle) {
  let grid = ''
  if (vehicle) {
    grid = '<div id="vehicle-detail">'
    grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    grid += '<div class="details">'
    grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    let price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(vehicle.inv_price)
    grid += '<h3>Price: ' + price + '</h3>'
    grid += '<p class="description">' + vehicle.inv_description + '</p>'
    grid += '<p class="color"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    let miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
    grid += '<p class="miles"><strong>Mileage:</strong> ' + miles + '</p>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }
  return grid
}

/* ****************************************
 * Classification Select List
 * **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* ****************************************
* Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 * Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  // 1. Check if user is logged in (this flag is set by checkJWTToken)
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type
    
    // 2. Check if they are authorized
    if (account_type == "Employee" || account_type == "Admin") {
      next() // Let them pass
    } else {
      // 3. Kick them out if they are just a Client
      req.flash("notice", "You do not have permission to access that resource.")
      return res.redirect("/account/login")
    }
  } else {
    // 4. Kick them out if not logged in at all
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util