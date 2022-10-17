const express = require("express");
const router = express.Router();
const userController = require("../controllers/imageController");

//single image
router.post("/storeuser", userController.InsertImageStoreUser); //single pic
router.post("/storefeatured", userController.InsertFeaturedImageStore); //single pic
//
router.post("/customer", userController.InsertImageCustomer); //single pic
router.post("/deliverypartner", userController.InsertImageDeliveryPartner); //single pic
//
//multiple images
router.post("/category", userController.InsertImageCategory); //multiple pics
router.post("/storetype", userController.InsertImageStoreType); //multiple pics
router.post("/bannerHome", userController.InsertHomeBanner); //multiple pics
//
router.post("/product", userController.InsertImageProduct); //multiple pics
router.post("/ticket", userController.InsertImageTicket); //multiple pics
router.post("/storegallery", userController.InsertGalleryImageStore); //multiple pic

//

//
router.get("/bannerHome", userController.GetHomeBanner);
//

module.exports = router;
