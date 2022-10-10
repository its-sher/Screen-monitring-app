var multer = require("multer");
const path = require("path");
const util = require("util");
const con = require("../models/db");
console.log("inside image controller");

const urlprefix = process.env.REACT_APP_DOMAIN_ENDPOINT;
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Store User Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
const InsertImageStoreUser = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/storeuser"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    // console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
  //   "photo",
  //   2
  // ); //multiple
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
    "photo"
  ); //single

  upload(req, res, function (err) {
    // console.log(req.file); //complete file
    if (!req.file) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      // console.log(req.file.filename);
      // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
      var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
      // console.log(imgsrc);
      res.status(200).json({
        success: "Success",
        url: imgsrc,
      });
    }
  });
};
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//Store User Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Customer Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
const InsertImageCustomer = (req, res) => {
  console.log(req.body);
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/customer"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    // console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
  //   "photo",
  //   2
  // ); //multiple
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
    "photo"
  ); //single

  upload(req, res, function (err) {
    // console.log(req.file); //complete file
    if (!req.file) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      // console.log(req.file.filename);
      // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
      var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
      // console.log(imgsrc);
      res.status(200).json({
        success: "Success",
        url: imgsrc,
      });
    }
  });
};
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//Customer Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//DeliveryPartner Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
const InsertImageDeliveryPartner = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/deliverypartner"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    // console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
  //   "photo",
  //   2
  // ); //multiple
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
    "photo"
  ); //single

  upload(req, res, function (err) {
    // console.log(req.file); //complete file
    if (!req.file) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      // console.log(req.file.filename);
      // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
      var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
      // console.log(imgsrc);
      res.status(200).json({
        success: "Success",
        url: imgsrc,
      });
    }
  });
};
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//deliverypartner Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Category Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
// const InsertImageCategory = (req, res) => {
//   var multerConfig = multer.diskStorage({
//     destination: function (req, file, callback) {
//       // console.log("2nd destination:  "); //yes file
//       // console.log(file);
//       callback(null, "uploads/category"); //giving location OR callBack(null, "./public/images/");
//     },
//     filename: function (req, file, callback) {
//       // console.log("3rd filename:  ");
//       // console.log(file);
//       const ext = file.mimetype.split("/")[1];
//       // callback(null, `image-${Date.now()}.${ext}`);//both works fine

//       callback(
//         null,
//         // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         Date.now().toString(11) + path.extname(file.originalname)
//       );
//     },
//   });

//   const isImage = (req, file, callback) => {
//     // console.log("1st isImage:  "); //yes file
//     // console.log(file);

//     if (file.mimetype.startsWith("image")) {
//       callback(null, true);
//     } else {
//       callback(new Error("Only Image is allowed"));
//     }
//   };

//   // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
//   //   "photo",
//   //   2
//   // ); //multiple
//   var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
//     "photo"
//   ); //single

//   upload(req, res, function (err) {
//     //  console.log(req.file); //complete file
//     if (!req.file) {
//       // console.log("No file upload");
//       return res.end("Error uploading file.");
//     } else {
//       // console.log(req.file.filename);
//       // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
//       var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
//       // var imgsrc = req.file.path; //url to save uploads\category\photo-1641197646690.jpeg wrong instead need / slash
//       //  console.log(imgsrc);
//       res.status(200).json({
//         success: "Success",
//         url: imgsrc,
//       });
//     }
//   });
// };
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertImageCategory = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/category"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    // console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);
  upload(req, res, function (err) {
    //  console.log(req.file); //complete file
    if (!req.files) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      // console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      //   console.log(pathOfFiles);
      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//Category Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Store Type Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
// const InsertImageStoreType = (req, res) => {
//   var multerConfig = multer.diskStorage({
//     destination: function (req, file, callback) {
//       // console.log("2nd destination:  "); //yes file
//       // console.log(file);
//       callback(null, "uploads/storetype"); //giving location OR callBack(null, "./public/images/");
//     },
//     filename: function (req, file, callback) {
//       // console.log("3rd filename:  ");
//       // console.log(file);
//       const ext = file.mimetype.split("/")[1];
//       // callback(null, `image-${Date.now()}.${ext}`);//both works fine

//       callback(
//         null,
//         //  file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         Date.now().toString(11) + path.extname(file.originalname)
//       );
//     },
//   });

//   const isImage = (req, file, callback) => {
//     // console.log("1st isImage:  "); //yes file
//     // console.log(file);

//     if (file.mimetype.startsWith("image")) {
//       callback(null, true);
//     } else {
//       callback(new Error("Only Image is allowed"));
//     }
//   };

//   // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
//   //   "photo",
//   //   2
//   // ); //multiple
//   var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
//     "photo"
//   ); //single

//   upload(req, res, function (err) {
//     // console.log(req.file); //complete file
//     if (!req.file) {
//       // console.log("No file upload");
//       return res.end("Error uploading file.");
//     } else {
//       // console.log(req.file.filename);
//       // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
//       var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
//       // console.log(imgsrc);
//       res.status(200).json({
//         success: "Success",
//         url: imgsrc,
//       });
//     }
//   });
// };
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertImageStoreType = (req, res) => {
  console.log("inside image");
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      console.log("2nd destination:  "); //yes file
      console.log(file);
      callback(null, "uploads/storetype"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      console.log("3rd filename:  ");
      console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        //  file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    console.log("1st isImage:  "); //yes file
    console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    console.log(req.file); //complete file
    if (!req.files) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      // console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      //   console.log(pathOfFiles);
      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//Store Type Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//insertHomeBanner Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertHomeBanner = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //   console.log("2nd destination:  "); //yes file
      //  console.log(file);
      callback(null, "uploads/banner"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //   console.log("3rd filename:  ");
      //   console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    //  console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };
  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    //console.log(req); //complete file
    if (!req.files) {
      //  console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      // console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      //   console.log(pathOfFiles);

      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//insertHomeBanner Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//InsertImageProduct++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertImageProduct = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //   console.log("2nd destination:  "); //yes file
      //  console.log(file);
      callback(null, "uploads/product"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //   console.log("3rd filename:  ");
      //   console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    //  console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };
  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    //console.log(req); //complete file
    if (!req.files) {
      //  console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      // console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      //   console.log(pathOfFiles);

      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//InsertImageProduct++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//InsertImageTicket++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertImageTicket = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //   console.log("2nd destination:  "); //yes file
      //  console.log(file);
      callback(null, "uploads/ticket"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //   console.log("3rd filename:  ");
      //   console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    //  console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };
  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    //console.log(req); //complete file
    if (!req.files) {
      //  console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      // console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      //   console.log(pathOfFiles);

      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//InsertImageTicket++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// GetHomeBanner from database table --banners---------------------------------------------------------------
const GetHomeBanner = (req, res) => {
  console.log("inside GetHomeBanner");
  //checking sql query----------------------------------------------STARTS
  // const sql =
  //   "SELECT s.id, s.name, st.name as store_type, CONCAT(" +
  //   urlprefix +
  //   ",s.images) as images, s.active_from, s.active_untill, s.active, s.created_at, s.updated_at from banners as s LEFT JOIN store_type as st ON s.store_type = st.id ORDER BY created_at DESC";
  // console.log(sql);
  //checking sql query----------------------------------------------ENDS

  con.query(
    "SELECT s.id, s.name, st.name as store_type, s.text, CONCAT('" +
      urlprefix +
      "',s.images) as images, s.active_from, s.active_untill, s.link, s.link_label, s.active, s.created_at, s.updated_at from banners as s LEFT JOIN store_type as st ON s.store_type = st.id ORDER BY created_at DESC",
    (err, response) => {
      if (!err) {
        if (response) {
          //  console.log(response);
          const Response = {
            status: "success",
            responsedata: { banners: response },
          };
          res.status(200).json(Response);
        }
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//-------------------------------------------------------------------------------------------------------------
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Store Featured Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
const InsertFeaturedImageStore = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/stores/featuredimage"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
  //   "photo",
  //   2
  // ); //multiple
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).single(
    "photo"
  ); //single

  upload(req, res, function (err) {
    console.log(req.file); //complete file
    if (!req.file) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      // console.log(req.file.filename);
      // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
      var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
      // console.log(imgsrc);
      res.status(200).json({
        success: "Success",
        url: imgsrc,
      });
    }
  });
};
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS
//Store Featured Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Store Gallery Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const InsertGalleryImageStore = (req, res) => {
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      // console.log("2nd destination:  "); //yes file
      // console.log(file);
      callback(null, "uploads/stores/gallery"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      // console.log("3rd filename:  ");
      // console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImage = (req, file, callback) => {
    // console.log("1st isImage:  "); //yes file
    console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  //1--works
  // var upload = util.promisify(
  //   multer({ storage: multerConfig, fileFilter: isImage }).array("photo", 3)
  // ); //multiple
  //2--works
  var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
    "photo",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);
  upload(req, res, function (err) {
    console.log(req.file); //complete file
    if (!req.files) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      const filesUploaded = req.files;
      console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        (a) => "/" + a.destination + "/" + a.filename
      );
      console.log(pathOfFiles);
      res.status(200).json({
        success: "Success",
        url: pathOfFiles,
      });
    }
  });
};
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//ENDS
//Store Gallery Image++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
module.exports = {
  InsertImageStoreUser,
  InsertImageCustomer,
  InsertImageDeliveryPartner,
  InsertImageCategory,
  InsertImageStoreType,
  GetHomeBanner,
  InsertHomeBanner,
  InsertImageProduct,
  InsertImageTicket,
  InsertFeaturedImageStore,
  InsertGalleryImageStore,
};
