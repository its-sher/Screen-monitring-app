const { base64encode, base64decode } = require("nodejs-base64");

//ENCODE
const encrypttheid = (req, res) => {
  //console.log(req);
  const dataid = req; //34
  //console.log(dataid);//34
  const encryptdata = (dataid * 123456789 * 5678) / 956783;
  //console.log(encryptdata);
  let encoded = base64encode(encryptdata);
  //console.log(encoded);//MjQ5MTAxMjAuNzE3MDU3MDUz
  return encoded;
};
//-----------------------------------------------------------------
//DECODE
const decodetheid = (req, res) => {
  const encodeddata = req; //MjQ5MTAxMjAuNzE3MDU3MDUz
  //console.log(encodeddata);
  let decoded = base64decode(encodeddata);
  const orgidBeforeRounding = (decoded * 956783) / (123456789 * 5678);
  const orgid = Math.round(orgidBeforeRounding);
  //console.log(orgid);//34
  return orgid;
};
//----------------------------------------------------------------
//GENERATE THE OTP FOR VERIFICATION PASSWORD FORGOT----------------------------------
const generateVerificationCodePF = () => {
  // Declare a digits variable
  // which stores all digits
  var digits = "123456789"; //0 removed vcz it creates error on postman when first digit is zero
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    //  OTP += digits[Math.floor(Math.random() * 10)];
    OTP += digits[Math.floor(Math.random() * 9)];
  }
  console.log(OTP);
  return OTP;
};
//-----------------------------------------------------------------------------------

module.exports = {
  encrypttheid,
  decodetheid,
  generateVerificationCodePF,
};
