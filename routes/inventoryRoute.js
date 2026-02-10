const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
router.get("/broken", utilities.handleErrors(invController.buildBroken))

router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", utilities.checkAccountType, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

/* ******************************************
 * Delete Inventory Routes
 * ****************************************** */

// Route to build the "Delete Confirmation" view
router.get("/delete/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

// Route to handle the delete
router.post("/delete", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router