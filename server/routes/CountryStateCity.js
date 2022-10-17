const express = require("express");
const router = express.Router();
const userController = require("../controllers/countrystatecityController");
//
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
