const con = require("../models/db");
const { errorHelper, add } = require("../helpers/instructions");
const table_name = "demo";
//
//GetAllCountries-DONE--------------------------------------------------------------
const GetAllCountries = (req, res) => {
  console.log("Inside GetAllCountries");
  const countriesData = Country.getAllCountries();
  //console.log(countriesData);
  if (countriesData && countriesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { countries: countriesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
//-------------------------------------------------------------------------------------------------------------
//
// GetCountryByCode-DONE--------------------------------------------------------------
const GetCountryByCode = (req, res) => {
  // Country.getCountryByCode(countryCode);
  console.log("Inside GetCountryByCode");
  const data = req.body;
  //console.log(data);
  if (
    data &&
    "key" in data !== "undefined" &&
    data.country &&
    data.country.length > 0
  ) {
    console.log("Valid Details");
    //
    const countryCode = data.country;
    //
    //console.log("Country Code: " + countryCode);
    //
    const countryData = Country.getCountryByCode(countryCode);
    //console.log(countryData);
    //
    if (
      countryData &&
      countryData !== undefined &&
      Object.keys(countryData).length != 0
    ) {
      console.log("Data Present");
      var finalArr = [];
      finalArr.push(countryData);
      //
      const Response = {
        status: "success",
        responsedata: { country: finalArr },
      };
      res.status(200).json(Response);
    } else {
      console.log("No Data");
      const Response = {
        status: "error",
        message: "no data in database",
      };
      res.status(204).json(Response);
    }
    //
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }

  //
};
//-------------------------------------------------------------------------------------------------------------
//
// GetAllStates-DONE--------------------------------------------------------------
const GetAllStates = (req, res) => {
  //  console.log(State.getAllStates());
  console.log("Inside GetAllStates");
  const statesData = State.getAllStates();
  //console.log(statesData);
  if (statesData && statesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { states: statesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
//-------------------------------------------------------------------------------------------------------------
//
// GetAllStatesOrStateofCountry-DONE--------------------------------------------------------------
// State.getStateByCodeAndCountry(stateCode, countryCode), State.getStatesOfCountry(countryCode)
const GetAllStatesOrStateofCountry = (req, res) => {
  //console.log(State.getStatesOfCountry("IN"));
  console.log("Inside GetAllStatesOrStateofCountry");
  const data = req.body;
  //console.log(data);
  if (
    data &&
    "key" in data !== "undefined" &&
    data.country &&
    data.country.length > 0 &&
    data.state &&
    data.state.length > 0
  ) {
    console.log("Valid Details");
    console.log("CASE-1 --> single state");
    //
    const countryCode = data.country;
    const stateCode = data.state;
    //
    // console.log("Country Code: " + countryCode);
    // console.log("State Code: " + stateCode);
    //
    const stateData = State.getStateByCodeAndCountry(stateCode, countryCode);
    //console.log(stateData);
    //
    if (
      stateData &&
      stateData !== undefined &&
      Object.keys(stateData).length != 0
    ) {
      console.log("Data Present");
      var finalArr = [];
      finalArr.push(stateData);
      //
      const Response = {
        status: "success",
        responsedata: { states: finalArr },
      };
      res.status(200).json(Response);
    } else {
      console.log("No Data");
      const Response = {
        status: "error",
        message: "no data in database",
      };
      res.status(204).json(Response);
    }
    //
  } else if (
    data &&
    "key" in data !== "undefined" &&
    data.country &&
    data.country.length > 0
  ) {
    console.log("Valid Details");
    console.log("CASE-2 --> All States of Country");
    //
    const countryCode = data.country;
    //
    // console.log("Country Code: " + countryCode);
    const statesData = State.getStatesOfCountry(countryCode); // all states of country
    //console.log(statesData);
    //
    if (statesData && statesData.length > 0) {
      console.log("Data Present");
      const Response = {
        status: "success",
        responsedata: { states: statesData },
      };
      res.status(200).json(Response);
    } else {
      console.log("No Data");
      const Response = {
        status: "error",
        message: "no data in database",
      };
      res.status(204).json(Response);
    }
    //
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
  //
};
//-------------------------------------------------------------------------------------------------------------
//
//GetAllCities-DONE--------------------------------------------------------------
const GetAllCities = (req, res) => {
  console.log("Inside GetAllCities");
  const citiesData = City.getAllCities();
  //console.log(citiesData);
  if (citiesData && citiesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { countries: citiesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
//-------------------------------------------------------------------------------------------------------------
// GetAllCitiesOfStateORCountry-DONE--------------------------------------------------------------
// City.getCitiesOfState(countryCode, stateCode)
// City.getCitiesOfCountry(countryCode)
const GetAllCitiesOfStateORCountry = (req, res) => {
  console.log("Inside GetAllCitiesOfStateORCountry");
  const data = req.body;
  //console.log(data);
  if (
    data &&
    "key" in data !== "undefined" &&
    data.country &&
    data.country.length > 0 &&
    data.state &&
    data.state.length > 0
  ) {
    // City.getCitiesOfState(countryCode, stateCode)
    console.log("Valid Details");
    console.log("CASE-1 --> get cities of state of country");
    //
    const countryCode = data.country;
    const stateCode = data.state;
    //
    // console.log("Country Code: " + countryCode);
    // console.log("State Code: " + stateCode);
    //
    const cityData = City.getCitiesOfState(countryCode, stateCode);
    //console.log(cityData);
    //
    if (cityData && cityData.length > 0) {
      console.log("Data Present");
      const Response = {
        status: "success",
        responsedata: { countries: cityData },
      };
      res.status(200).json(Response);
    } else {
      console.log("No Data");
      const Response = {
        status: "error",
        message: "no data in database",
      };
      res.status(204).json(Response);
    }
    //
  } else if (
    data &&
    "key" in data !== "undefined" &&
    data.country &&
    data.country.length > 0
  ) {
    // City.getCitiesOfCountry(countryCode)
    console.log("Valid Details");
    console.log("CASE-2 --> get cities of country");
    //
    const countryCode = data.country;
    // console.log("Country Code: " + countryCode);
    //
    const cityData = City.getCitiesOfCountry(countryCode);
    //console.log(cityData);
    //
    if (cityData && cityData.length > 0) {
      console.log("Data Present");
      const Response = {
        status: "success",
        responsedata: { countries: cityData },
      };
      res.status(200).json(Response);
    } else {
      console.log("No Data");
      const Response = {
        status: "error",
        message: "no data in database",
      };
      res.status(204).json(Response);
    }
    //
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
  //
};
//-------------------------------------------------------------------------------------------------------------
//
const Add = async (req, res) => {
  // console.log("Inside Add");
  // console.log(req.body);
  const payload = req.body;
  const addResp = await add(table_name, payload);
  console.log("Back");
  //console.log(resp);
  if (
    addResp &&
    addResp !== undefined &&
    Object.keys(addResp).length != 0 &&
    addResp.status == "success"
  ) {
    // console.log(addResp.id);
    res.status(201).json(addResp);
  } else if (addResp.status == "error") {
    console.log("Sql Error");
    //console.log(resp);
    const errResp = await errorHelper(addResp.message);
    console.log("Back errResp");
    console.log(errResp);

    const Response = {
      status: "error",
      message: "Sql Error",
      error: errResp,
    };
    res.status(203).json(Response);
  } else {
    console.log("Server Error");
    const Response = {
      status: "error",
      message: "Server Error",
    };
    res.status(204).json(Response);
  }
};
const Edit = (req, res) => {
  console.log("Inside Edit");
  const countriesData = Country.getAllCountries();
  //console.log(countriesData);
  if (countriesData && countriesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { countries: countriesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
const View = (req, res) => {
  console.log("Inside View");
  const countriesData = Country.getAllCountries();
  //console.log(countriesData);
  if (countriesData && countriesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { countries: countriesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
const Delete = (req, res) => {
  console.log("Inside Delete");
  const countriesData = Country.getAllCountries();
  //console.log(countriesData);
  if (countriesData && countriesData.length > 0) {
    console.log("Data Present");
    const Response = {
      status: "success",
      responsedata: { countries: countriesData },
    };
    res.status(200).json(Response);
  } else {
    console.log("No Data");
    const Response = {
      status: "error",
      message: "no data in database",
    };
    res.status(204).json(Response);
  }
};
module.exports = {
  GetAllCountries,
  GetCountryByCode,
  //
  GetAllStates,
  GetAllStatesOrStateofCountry,
  //
  GetAllCities,
  GetAllCitiesOfStateORCountry,
  //
  Add,
  Edit,
  View,
  Delete,
};
