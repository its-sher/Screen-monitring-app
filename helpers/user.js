const con = require("../models/db");
//const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  // encrypttheid,
  decodetheid,
  generateVerificationCodePF,
} = require("../helpers/encode-decode");
const { sendemail } = require("../helpers/email");
var testEmail = "khushvirajiva@gmail.com"; //testing
//var testEmail = "sanjayajivainfotech@gmail.com"; //testing
//
//USER EMAIL ___________________________________________________STARTS
//NEW USER CREATED - SEND EMAIL*********************************************************************************
const UserCreated = (data) => {
  console.log("email user - new account created successfully");
  const user_data = data;
  // console.log(user_data);
  //
  const fulname = user_data[0].first_Name + " " + user_data[0].last_Name;
  const phone = user_data[0].phone;
  const emailto = user_data[0].email;
  //const emailto = testEmail; //testing
  //
  const output = `
  <p>Hello, ${fulname},
  your account has been created Successfully.</p>
  <h3>If you are not aware of this change. Please contact our support team on below details:</h3>
  <h3>Contact: +91-9898989898</h3>
  <h3>Email: care@ezmoov.com</h3>
  <p>This is a auto-generated email. Please do not reply to this email.</p>
  `;
  //
  let mailOptions = {
    from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
    to: emailto, // list of receivers
    //to: "khushvirsgl@gmail.com",   //for checking purpose only
    subject: "Intimation Account Creation", // Subject line
    text: "Account Created Successfully", // plain text body
    html: output, // html body
  };
  //
  let transporter = nodemailer.createTransport({
    host: "ajivainfotech.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
      pass: "Welcome@12", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //
  var email_helper_data = [];
  var temp = {};
  temp["mailOptions"] = mailOptions;
  temp["transporter"] = transporter;
  email_helper_data.push(temp);
  // console.log(email_helper_data);
  //
  //send email starts-----------------------------------------
  async function check() {
    // console.log("before waiting");
    //await testAsync();
    let resp = await sendemail(email_helper_data);
    //console.log(resp);
    // console.log("After waiting");
    if (resp == "success") {
      console.log("Email Successfully Sent");
      // const Response = {
      //   status: "success",
      //   responsedata: {
      //     message: "Email Successfully Sent",
      //   },
      // };
      // return res.status(200).json(Response);
      //return Response;
    } else if (resp == "failure") {
      console.log(err);
      console.log("Email Failure");
      //   const Error = { status: "error", message: "Server Error" };
      //   return res.status(400).json(Error);
      //return Error;
    }
  }
  check();
  //send email ends -----------------------------------------
};
//*************************************************************************************************************
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ACCOUNT VERIFICATION CODE++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const UserAccountVerificationCodeEmail = async (data) => {
  console.log("inside user account verification code send email");
  const user_data = data;
  // console.log(user_data);
  //
  const user_id = user_data[0].id;
  const fulname = user_data[0].first_Name + " " + user_data[0].last_Name;
  const phone = user_data[0].phone;
  const emailto = user_data[0].email;
  //const emailto = testEmail; //testing
  //
  //generate otp using function starts---------------------------1--starts
  const verificationcode = generateVerificationCodePF();
  //generate otp using function ends-----------------------------1--ends
  //
  if (verificationcode && verificationcode > 0) {
    console.log("Valid Code");
    //
    //collect data for email--------------------------------------------------2--starts
    const output = `
        <p>Hello, ${fulname},
        you have requested for Account Verification and following that you are sent this email.</p>
        <h3>Below is the Details of 6 digit pin you can use to verify your account</h3>
        <h3>Carefully read the otp and enter on the screen from where you asked for Account Verificaton</h3>
        <p>${verificationcode}</p>
        <p>This is a auto-generated email. Please do not reply to this email.</p>
        `;
    //
    let mailOptions = {
      from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
      to: emailto, // list of receivers
      subject: "Intimation Account Settings", // Subject line
      text: "Account Verification Request", // plain text body
      html: output, // html body
    };
    //
    let transporter = nodemailer.createTransport({
      host: "ajivainfotech.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
        pass: "Welcome@12", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //
    //  response[0]["mailOptions"] = mailOptions;
    //  response[0]["transporter"] = transporter;
    var email_helper_data = [];
    var temp = {};
    temp["mailOptions"] = mailOptions;
    temp["transporter"] = transporter;
    email_helper_data.push(temp);
    // console.log(email_helper_data);
    //collect data for email--------------------------------------------------2--ends
    //
    //save verification_code into db-----------------------3--starts
    var save_Data = {};
    var user_data_resp;
    save_Data["verification_code"] = verificationcode;
    //
    async function updateUser(userID, saveData) {
      console.log("Inside updateUser");
      return new Promise((resolve, reject) => {
        //   console.log(userID);
        //   console.log(saveData);
        //
        const sql = con.query(
          "UPDATE users SET ? WHERE id=?",
          [saveData, userID],
          (err, result) => {
            if (!err) {
              console.log(result);
              //   console.log(result.affectedRows);
              if (result.affectedRows > 0) {
                console.log("STEP-1 --> Updated user successful");
                resolve({
                  result: 1,
                });
              } else {
                console.log("NOTHING UPDATED - case shouldn't work");
                messageERR = "Invalid Details";
                // const Error = { status: "error", message: "Invalid Details" };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("UPDATE SLQ ERRRRRRRRRRRRRRRRORRRRRRRRRR");
              console.log(err);
              messageERR = "Server Error";
              //  const Error = { status: "error", message: "Server Error" };
              //   res.status(400).json(Error);
              reject({
                result: 0,
              });
            }
          }
        );
        // console.log(sql.sql);
        //
        //
      }).catch((error) => console.log(error.message));
    }
    user_data_resp = await updateUser(user_id, save_Data);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(user_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");

    if (
      user_data_resp &&
      user_data_resp !== undefined &&
      Object.keys(user_data_resp).length != 0 &&
      user_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY-----------------------");
      console.log("STEP-2 STARTS");
      const respp = await check(email_helper_data);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      // console.log(respp);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      return respp;
    } else {
      console.log("STEP 1 Error- save verification code failed ");
      // const Error = {
      //   status: "error",
      //   message: "Server Error",
      // };
      // res.status(400).json(Error);
    }
    //save verification_code into db-----------------------3--ends
    //
    //send email starts-----------------------------------------4--starts
    async function check(data) {
      // console.log("before waiting");
      //await testAsync();
      let resp = await sendemail(data);
      //console.log(resp);
      // console.log("After waiting");
      if (resp == "success") {
        const Response = {
          status: "success",
          responsedata: {
            message: "Email Successfully Sent",
            // verification_code: verificationcode,
          },
        };
        return Response;
      } else if (resp == "failure") {
        console.log(err);
        const Error = { status: "error", message: "Email Sending Failed" };
        return Error;
      }
    }
    //send email ends -----------------------------------------4--ends
    //
  } else {
    console.log("Invalid verification code");
    const Error = { status: "error", message: "Server Error" };
    return Error;
  }
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PASSWORD FORGOT - SEND EMAIL - WITH VERIFICATION CODE++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ForgotPasswordVerificationCodeEmail = async (data) => {
  console.log("inside ForgotPasswordVerificationCodeEmail helper");
  const user_data = data;
  // console.log(user_data);
  //
  const user_id = user_data[0].id;
  const fulname = user_data[0].first_Name + " " + user_data[0].last_Name;
  const phone = user_data[0].phone;
  const emailto = user_data[0].email;
  //const emailto = testEmail; //testing
  //
  //generate otp using function starts---------------------------1--starts
  const verificationcode = generateVerificationCodePF();
  //generate otp using function ends-----------------------------1--ends
  //
  if (verificationcode && verificationcode > 0) {
    console.log("Valid Code");
    //
    //collect data for email--------------------------------------------------2--starts
    const output = `
    <p>Hello, ${fulname},
    you have requested for Forgot Password, and following that you are sent this email.</p>
    <h3>Below is the Details of 6 digit pin you can use to rest your password</h3>
    <h3>Carefully read the otp and enter on the screen from where you asked for forgot password option</h3>
    <p>${verificationcode}</p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    `;

    let mailOptions = {
      from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
      to: emailto, // list of receivers
      subject: "Intimation Account Settings", // Subject line
      text: "Password Change Request", // plain text body
      html: output, // html body
    };

    let transporter = nodemailer.createTransport({
      host: "ajivainfotech.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
        pass: "Welcome@12", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //
    //  response[0]["mailOptions"] = mailOptions;
    //  response[0]["transporter"] = transporter;
    var email_helper_data = [];
    var temp = {};
    temp["mailOptions"] = mailOptions;
    temp["transporter"] = transporter;
    email_helper_data.push(temp);
    // console.log(email_helper_data);
    //collect data for email--------------------------------------------------2--ends
    //
    //save verification_code into db-----------------------3--starts
    var save_Data = {};
    var user_data_resp;
    save_Data["verification_code"] = verificationcode;
    //
    async function updateUser(userID, saveData) {
      console.log("Inside updateUser");
      return new Promise((resolve, reject) => {
        //   console.log(userID);
        //   console.log(saveData);
        //
        const sql = con.query(
          "UPDATE users SET ? WHERE id=?",
          [saveData, userID],
          (err, result) => {
            if (!err) {
              console.log(result);
              //   console.log(result.affectedRows);
              if (result.affectedRows > 0) {
                console.log("STEP-1 --> Updated user successful");
                resolve({
                  result: 1,
                });
              } else {
                console.log("NOTHING UPDATED - case shouldn't work");
                messageERR = "Invalid Details";
                // const Error = { status: "error", message: "Invalid Details" };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("UPDATE SLQ ERRRRRRRRRRRRRRRRORRRRRRRRRR");
              console.log(err);
              messageERR = "Server Error";
              //  const Error = { status: "error", message: "Server Error" };
              //   res.status(400).json(Error);
              reject({
                result: 0,
              });
            }
          }
        );
        // console.log(sql.sql);
        //
        //
      }).catch((error) => console.log(error.message));
    }
    user_data_resp = await updateUser(user_id, save_Data);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(user_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");

    if (
      user_data_resp &&
      user_data_resp !== undefined &&
      Object.keys(user_data_resp).length != 0 &&
      user_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY-----------------------");
      console.log("STEP-2 STARTS");
      const respp = await check(email_helper_data);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      // console.log(respp);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      return respp;
    } else {
      console.log("STEP 1 Error- save verification code failed ");
      // const Error = {
      //   status: "error",
      //   message: "Server Error",
      // };
      // res.status(400).json(Error);
    }
    //save verification_code into db-----------------------3--ends
    //
    //send email starts-----------------------------------------4--starts
    async function check(data) {
      // console.log("before waiting");
      //await testAsync();
      let resp = await sendemail(data);
      //console.log(resp);
      // console.log("After waiting");
      if (resp == "success") {
        const Response = {
          status: "success",
          responsedata: {
            message: "Email Successfully Sent",
            // verification_code: verificationcode,
          },
        };
        return Response;
      } else if (resp == "failure") {
        console.log(err);
        const Error = { status: "error", message: "Email Sending Failed" };
        return Error;
      }
    }
    //send email ends -----------------------------------------4--ends
    //
  } else {
    console.log("Invalid verification code");
    const Error = { status: "error", message: "Server Error" };
    return Error;
  }
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
const VerificationCodeEmail = async (data) => {
  console.log("inside VerificationCodeEmail helper");
  const user_data = data;
  // console.log(user_data);
  //
  const user_id = user_data[0].id;
  const fulname = user_data[0].first_Name + " " + user_data[0].last_Name;
  const phone = user_data[0].phone;
  //const emailto = user_data[0].email;
  const emailto = testEmail; //testing
  //
  //generate otp using function starts---------------------------1--starts
  const verificationcode = generateVerificationCodePF();
  //generate otp using function ends-----------------------------1--ends
  //
  if (verificationcode && verificationcode > 0) {
    console.log("Valid Code");
    //
    //collect data for email--------------------------------------------------2--starts
    const output = `
    <p>Hello, ${fulname},
    you have requested for service which requires verification and following that you are sent this email.</p>
    <h3>Below is the Details of 6 digit pin you can use to verify</h3>
    <h3>Carefully read the otp and enter on the screen from where you asked for the service</h3>
    <p>${verificationcode}</p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    `;

    let mailOptions = {
      from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
      to: emailto, // list of receivers
      subject: "Intimation Account Settings", // Subject line
      text: "Verification Request", // plain text body
      html: output, // html body
    };

    let transporter = nodemailer.createTransport({
      host: "ajivainfotech.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
        pass: "Welcome@12", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //
    //  response[0]["mailOptions"] = mailOptions;
    //  response[0]["transporter"] = transporter;
    var email_helper_data = [];
    var temp = {};
    temp["mailOptions"] = mailOptions;
    temp["transporter"] = transporter;
    email_helper_data.push(temp);
    // console.log(email_helper_data);
    //collect data for email--------------------------------------------------2--ends
    //
    //save verification_code into db-----------------------3--starts
    var save_Data = {};
    var user_data_resp;
    save_Data["verification_code"] = verificationcode;
    //
    async function updateUser(userID, saveData) {
      console.log("Inside updateUser");
      return new Promise((resolve, reject) => {
        //   console.log(userID);
        //   console.log(saveData);
        //
        const sql = con.query(
          "UPDATE users SET ? WHERE id=?",
          [saveData, userID],
          (err, result) => {
            if (!err) {
              console.log(result);
              //   console.log(result.affectedRows);
              if (result.affectedRows > 0) {
                console.log("STEP-1 --> Updated user successful");
                resolve({
                  result: 1,
                });
              } else {
                console.log("NOTHING UPDATED - case shouldn't work");
                messageERR = "Invalid Details";
                // const Error = { status: "error", message: "Invalid Details" };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("UPDATE SLQ ERRRRRRRRRRRRRRRRORRRRRRRRRR");
              console.log(err);
              messageERR = "Server Error";
              //  const Error = { status: "error", message: "Server Error" };
              //   res.status(400).json(Error);
              reject({
                result: 0,
              });
            }
          }
        );
        // console.log(sql.sql);
        //
        //
      }).catch((error) => console.log(error.message));
    }
    user_data_resp = await updateUser(user_id, save_Data);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(user_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");

    if (
      user_data_resp &&
      user_data_resp !== undefined &&
      Object.keys(user_data_resp).length != 0 &&
      user_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY-----------------------");
      console.log("STEP-2 STARTS");
      const respp = await check(email_helper_data);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      // console.log(respp);
      // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk");
      return respp;
    } else {
      console.log("STEP 1 Error- save verification code failed ");
      // const Error = {
      //   status: "error",
      //   message: "Server Error",
      // };
      // res.status(400).json(Error);
    }
    //save verification_code into db-----------------------3--ends
    //
    //send email starts-----------------------------------------4--starts
    async function check(data) {
      // console.log("before waiting");
      //await testAsync();
      let resp = await sendemail(data);
      //console.log(resp);
      // console.log("After waiting");
      if (resp == "success") {
        const Response = {
          status: "success",
          responsedata: {
            message: "Email Successfully Sent",
            // verification_code: verificationcode,
          },
        };
        return Response;
      } else if (resp == "failure") {
        console.log(err);
        const Error = { status: "error", message: "Email Sending Failed" };
        return Error;
      }
    }
    //send email ends -----------------------------------------4--ends
    //
  } else {
    console.log("Invalid verification code");
    const Error = { status: "error", message: "Server Error" };
    return Error;
  }
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PASSWORD CHANGED SUCCESSFULLY - SEND EMAIL TO NOTIFY=========================================================
const UserPasswordChangedEmail = (params) => {
  console.log("inside password changed successfully");
  const userIdFP = params;
  //console.log(userIdFP);
  //
  con.query(
    "SELECT id, first_Name, last_Name, phone, email FROM users WHERE id=?",
    [userIdFP],
    async (err, response) => {
      if (!err) {
        //DATA
        //console.log(response);
        const fulname = response[0].first_Name + " " + response[0].last_Name;
        const emailto = response[0].email;
        //const emailto = testEmail; //testing

        const output = `
<p>Hello, ${fulname},
you have changed your Password Successfully.</p>
<h3>If you are not aware of this change. Please contact our support team on below details:</h3>
<h3>Contact: +91-9898989898</h3>
<h3>Email: care@ezmoov.com</h3>
<p>This is a auto-generated email. Please do not reply to this email.</p>
`;

        let mailOptions = {
          from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
          to: emailto, // list of receivers
          subject: "Intimation Account Settings", // Subject line
          text: "Password Changed Successfully", // plain text body
          html: output, // html body
        };

        let transporter = nodemailer.createTransport({
          host: "ajivainfotech.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
            pass: "Welcome@12", // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        //

        response[0]["mailOptions"] = mailOptions;
        response[0]["transporter"] = transporter;

        //send email starts-----------------------------------------
        async function check() {
          // console.log("before waiting");
          //await testAsync();
          let resp = await sendemail(response);
          //console.log(resp);
          // console.log("After waiting");
          if (resp == "success") {
            console.log("Email Successfully Sent");

            // const Response = {
            //   status: "success",
            //   responsedata: {
            //     message: "Email Successfully Sent",
            //   },
            // };
            //            return res.status(200).json(Response);
            // return Response;
          } else if (resp == "failure") {
            console.log(err);
            console.log("Email Failure");

            //const Error = { status: "error", message: "Server Error" };
            // return res.status(400).json(Error);
            //return Error;
          }
        }
        check();
        //send email ends -----------------------------------------
      } else {
        console.log(err);
        console.log("Email Failure");
        // const Error = { status: "error", message: "Server Error" };
        //res.status(400).json(Error);
        // return Error;
      }
    }
  );
};
//=============================================================================================================
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// OtpVerified SUCCESSFULLY - SEND EMAIL TO NOTIFY=========================================================
const OtpVerified = (userID, entity) => {
  console.log("inside OtpVerified successfully");
  const userIdFP = userID;
  //console.log(userIdFP);
  //
  con.query(
    "SELECT id, first_Name, last_Name, phone, email FROM users WHERE id=?",
    [userIdFP],
    async (err, response) => {
      if (!err) {
        //DATA
        //console.log(response);
        const fulname = response[0].first_Name + " " + response[0].last_Name;
        //const emailto = response[0].email;
        const emailto = testEmail; //testing

        const output = `
<p>Hello, ${fulname},
you have successfully verified OTP for ${entity}.</p>
<h3>If you are not aware of this. Please contact our support team on below details:</h3>
<h3>Contact: +91-9898989898</h3>
<h3>Email: care@ezmoov.com</h3>
<p>This is a auto-generated email. Please do not reply to this email.</p>
`;

        let mailOptions = {
          from: '"EZMOOV " <khushvirsingh@ajivainfotech.com>', // sender address
          to: emailto, // list of receivers
          subject: "Intimation Account Settings", // Subject line
          text: `Verified OTP Successfully for ${entity}`, // plain text body
          html: output, // html body
        };

        let transporter = nodemailer.createTransport({
          host: "ajivainfotech.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "khushvirsingh@ajivainfotech.com", // generated ethereal user
            pass: "Welcome@12", // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        //

        response[0]["mailOptions"] = mailOptions;
        response[0]["transporter"] = transporter;

        //send email starts-----------------------------------------
        async function check() {
          // console.log("before waiting");
          //await testAsync();
          let resp = await sendemail(response);
          //console.log(resp);
          // console.log("After waiting");
          if (resp == "success") {
            console.log("Email Successfully Sent");

            // const Response = {
            //   status: "success",
            //   responsedata: {
            //     message: "Email Successfully Sent",
            //   },
            // };
            //            return res.status(200).json(Response);
            // return Response;
          } else if (resp == "failure") {
            console.log(err);
            console.log("Email Failure");

            //const Error = { status: "error", message: "Server Error" };
            // return res.status(400).json(Error);
            //return Error;
          }
        }
        check();
        //send email ends -----------------------------------------
      } else {
        console.log(err);
        console.log("Email Failure");
        // const Error = { status: "error", message: "Server Error" };
        //res.status(400).json(Error);
        // return Error;
      }
    }
  );
};
//
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//USER EMAIL ___________________________________________________ENDS
//
module.exports = {
  UserCreated,
  //
  UserAccountVerificationCodeEmail,
  VerificationCodeEmail,
  OtpVerified,
  //
  ForgotPasswordVerificationCodeEmail,
  UserPasswordChangedEmail,
  //
};
