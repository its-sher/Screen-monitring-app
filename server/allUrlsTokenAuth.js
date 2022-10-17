const staticglobaltokenforurls = process.env.REQUEST_TOKEN;

//VALIDATE TOKEN FOR EACH URL------------------------------------------------------
// const staticglobaltokenforurls =
//   "Bearer hjskdhskjdhsjkdhskjdhskjdhskdhskjdhsdjksjhdsjkdsdks";
//allurlsvalidatetoken
module.exports = allurlsvalidatetoken = (req, res, next) => {
  //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  // console.log(req.body.HEADERS.headers.token);
  console.log("inside all urls validate token");
  // console.log(req.body);
  // console.log(req.headers);
  const headersvalue = req.headers.token; //----FOR All Now
  //const headersvalue = req.body.headers.token; //FOR BROWSER
  // console.log(headersvalue);
  //console.log(req.headers.token);
  if (!headersvalue) {
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    return res.status(403).json({ error: "Url Forbidden!" });
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  } else {
    try {
      if (staticglobaltokenforurls == headersvalue)
        //sql code
        console.log("ok genuine");
      return next();
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
};
//---------------------------------------------------------------------------------------
