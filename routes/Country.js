const express = require("express");
const router = express.Router();
const userController = require("../controllers/countryController");
//
router.post("/testadd", userController.Add); //done
router.put("/testedit/:id", userController.Edit); //done
router.get("/testview/:id", userController.View); //done
router.delete("/testdelete/:id", userController.Delete); //done

router.get("/", userController.GetAllCountries); //done
router.post("/", userController.GetCountryByCode); //done
//
router.get("/states", userController.GetAllStates); //done
router.post("/states", userController.GetAllStatesOrStateofCountry); //done
//
router.get("/cities", userController.GetAllCities); //done
router.post("/cities", userController.GetAllCitiesOfStateORCountry); //done
//
module.exports = router;
