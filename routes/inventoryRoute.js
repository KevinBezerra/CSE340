// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to build the "broken" error link
router.get("/broken", utilities.handleErrors(invController.buildBroken))

/* ******************************************
 * Assignment 4 Routes
 * ****************************************** */

// 1. Management View (The Dashboard)
router.get("/", utilities.handleErrors(invController.buildManagement))

// 2. Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// 3. Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;