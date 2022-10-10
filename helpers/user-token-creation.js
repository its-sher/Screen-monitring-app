const { base64encode, base64decode } = require("nodejs-base64");
var md5 = require("md5");
const { v4: uuidv4 } = require("uuid");

//ENCRYPTION
const accesstokencreation = (req, res) => {
  // console.log(req[0].id);
  const result = req[0];
  // console.log(result.id);
  const userid = result.id; //194
  const multiply = userid * 38727; //----------------------------------later
  const date = Date.now();
  //console.log(date);
  const data = date + userid + multiply; //194123456789//--------------later
  //console.log(data); //concat 194123456789
  const encryptdata = (data * 127234596475 * 59459037) / 956783;
  //  console.log(encryptdata);
  let encoded = base64encode(encryptdata);
  //console.log(encoded); //MjQ5MTAxMjAuNzE3MDU3MDUz
  let md5encryption = md5(encoded);
  //console.log(md5encryption);
  const random_key = uuidv4();
  //console.log(random_key);
  const new_str = random_key + md5encryption;
  //console.log(new_str);
  let encodeBase64Again = base64encode(new_str);
  //console.log(encodeBase64Again);
  return encodeBase64Again;
};
//-----------------------------------------------------------------
const refreshtokencreation = (req, res) => {
  // console.log(req[0].id);
  const result = req[0];
  // console.log(result.id);
  const userid = result.id; //194
  const multiply = userid * 723593727; //----------------------------------later
  const date = Date.now();
  //console.log(date);
  const data = date + userid + multiply; //194123456789//--------------later
  // console.log(data); //concat 194123456789
  const encryptdata = (data * 92876962487 * 17593678) / 79596753;
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

module.exports = { accesstokencreation, refreshtokencreation, create_token };
