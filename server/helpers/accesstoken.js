const { base64encode, base64decode } = require("nodejs-base64");
var md5 = require("md5");

//ENCRYPTION
const usertokencreation = (req, res) => {
  // console.log(req[0].id);
  const result = req[0];
  // console.log(result.id);
  const userid = result.id; //194
  const multiply = userid * 38727; //----------------------------------later
  const phone = result.phone; //123456789
  const date = Date.now();
  //console.log(date);
  // const data = date + userid + phone; //194123456789//---org
  const data = date + userid + phone + multiply; //194123456789//--------------later
  // console.log(data); //concat 194123456789

  const encryptdata = (data * 123456789 * 5678) / 956783;
  // console.log(encryptdata);
  let encoded = base64encode(encryptdata);
  //console.log(encoded);//MjQ5MTAxMjAuNzE3MDU3MDUz
  let md5encryption = md5(encoded);
  //console.log(md5encryption);
  return md5encryption;
};
//-----------------------------------------------------------------
const create_token = (req, res) => {
  //params-->  basic_auth
  //return access_token, refresh_token

  // console.log(req[0].id);
  const result = req[0];
  // console.log(result.id);
  const userid = result.id; //194
  const multiply = userid * 38727; //----------------------------------later
  const phone = result.phone; //123456789
  const date = Date.now();
  //console.log(date);
  // const data = date + userid + phone; //194123456789//---org
  const data = date + userid + phone + multiply; //194123456789//--------------later
  // console.log(data); //concat 194123456789

  const encryptdata = (data * 123456789 * 5678) / 956783;
  // console.log(encryptdata);
  let encoded = base64encode(encryptdata);
  //console.log(encoded);//MjQ5MTAxMjAuNzE3MDU3MDUz
  let md5encryption = md5(encoded);
  //console.log(md5encryption);
  return md5encryption;
};
//-
// Create_token(basic_auth){
// 	return {
// 		access_token
// 	    refresh_token
// 	}
// }

module.exports = { usertokencreation, create_token };
