const con = require("../models/db");
//const moment = require("moment");
const {
  encrypttheid,
  decodetheid,
  generateVerificationCodePF,
} = require("../helpers/encode-decode");

//EncryptId-------------------------------------------------------------------STARTS
const EncryptId = (req, res) => {
  console.log(req.params.id);
  const idToBeEncrypted = req.params.id;
  console.log(idToBeEncrypted);

  const encryptedid = encrypttheid(idToBeEncrypted);

  const Response = {
    encryptedid: encryptedid,
    message: "Encryption Successfull for id=" + idToBeEncrypted,
  };
  res.status(200).json(Response);

  // console.log(err);
  // const Response = {
  //   Error: err,
  // };
  // res.status(400).json(Response);
};
//EncryptId-------------------------------------------------------------------ENDS
//DecodeId-------------------------------------------------------------------STARTS
const DecodeId = (req, res) => {
  console.log(req.params.id);
  const idToBeDecoded = req.params.id;
  console.log(idToBeDecoded);

  const decodedid = decodetheid(idToBeDecoded);

  const Response = {
    decodedid: decodedid,
    message: "Decoding Successfull for id=" + idToBeDecoded,
  };
  res.status(200).json(Response);

  // console.log(err);
  // const Response = {
  //   Error: err,
  // };
  // res.status(400).json(Response);
};
//DecodeId-------------------------------------------------------------------ENDS
//-------------------------------------------------------------------------------------------------------------
module.exports = {
  EncryptId,
  DecodeId,
};
