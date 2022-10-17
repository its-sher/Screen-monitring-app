const nodemailer = require("nodemailer");

function sendemail(req) {
  return new Promise((resolve, reject) => {
    let mailOptions = req[0].mailOptions;
    //console.log(mailOptions);
    let transporter = req[0].transporter;
    //console.log(transporter);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject("failure");
      } else {
        //console.log("1");
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // console.log("2");
        // return res.render("contact", { msg: "Email has been sent" });
        resolve("success");
        //return "success";
      }
    });

    //here our function should be implemented
    // setTimeout(() => {
    //   console.log("Hello from inside the testAsync function");
    //   resolve();
    // }, 5000);
  });
}
//+++++++++++++++------------------++++++++++================++++++++++++++++++++++++++++_____________+=============------------------------------

module.exports = { sendemail };
