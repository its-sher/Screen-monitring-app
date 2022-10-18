var multer = require("multer");
const path = require("path");
const util = require("util");
const con = require("../models/db");
const fs = require("fs-extra"); //npm install fs.extra

console.log("inside image controller");

const urlprefix = process.env.REACT_APP_DOMAIN_ENDPOINT;
//
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const Project = (req, res) => {
  console.log("inside Project");
  //console.log(req);
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //console.log("2nd destination:  "); //yes file
      //console.log(file);
      //THIS
      const directory = `./uploads/project/${req.params.id}`;
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      callback(null, directory); //giving location OR callBack(null, "./public/images/");
      //OR
      // callback(null, "uploads"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //console.log("3rd filename:  ");
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        //  file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImagePdfDocxXlsxCsv = (req, file, callback) => {
    //console.log("1st isImagePdfDocxXlsxCsv:  "); //yes file
    //console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("pdf")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("xlsx")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("csv")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("docx")) {
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
  var upload = multer({
    storage: multerConfig,
    fileFilter: isImagePdfDocxXlsxCsv,
  }).array(
    "attachment",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    //console.log(req.file); //complete file
    if (!req.files) {
      // console.log("No file upload");
      return res.end("Error uploading files.");
    } else {
      const filesUploaded = req.files;
      //console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        //  (a) => "/" + a.destination + "/" + a.filename
        (a) => "/" + a.path
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
//
//++++++++++++++++++++++++MULTIPLE++++++++++++++++++++++++++++//STARTS
const Logs = (req, res) => {
  console.log("inside Logs");
  //console.log(req);
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //console.log("2nd destination:  "); //yes file
      //console.log(file);
      //THIS
      const directory = `./uploads/logs/${req.params.id}`;
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      callback(null, directory); //giving location OR callBack(null, "./public/images/");
      //OR
      // callback(null, "uploads"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //console.log("3rd filename:  ");
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        //  file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImagePdfDocxXlsxCsv = (req, file, callback) => {
    //console.log("1st isImagePdfDocxXlsxCsv:  "); //yes file
    //console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("pdf")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("xlsx")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("csv")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("docx")) {
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
  var upload = multer({
    storage: multerConfig,
    fileFilter: isImagePdfDocxXlsxCsv,
  }).array(
    "attachment",
    10 //limit of 10 files
  ); //multiple files upload

  //var uploadFilesMiddleware = util.promisify(uploadFiles);

  upload(req, res, function (err) {
    //console.log(req.file); //complete file
    if (!req.files) {
      // console.log("No file upload");
      return res.end("Error uploading files.");
    } else {
      const filesUploaded = req.files;
      //console.log(filesUploaded);
      let pathOfFiles = {};
      //  pathOfFiles = filesUploaded.map((a) => a.path); //shows error double slashes //dsds//sdsd/
      pathOfFiles = filesUploaded.map(
        //  (a) => "/" + a.destination + "/" + a.filename
        (a) => "/" + a.path
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
//
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//STARTS
const Employee = (req, res) => {
  console.log("Employee");
  //console.log(req);
  var multerConfig = multer.diskStorage({
    destination: function (req, file, callback) {
      //console.log("2nd destination:  "); //yes file
      //console.log(file);
      //THIS
      const directory = `./uploads/employee/${req.params.id}`;
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      callback(null, directory); //giving location OR callBack(null, "./public/images/");
      //OR
      // callback(null, "uploads"); //giving location OR callBack(null, "./public/images/");
    },
    filename: function (req, file, callback) {
      //console.log("3rd filename:  ");
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      // callback(null, `image-${Date.now()}.${ext}`);//both works fine

      callback(
        null,
        // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        Date.now().toString(11) + path.extname(file.originalname)
      );
    },
  });

  const isImagePdfDocxXlsxCsv = (req, file, callback) => {
    //console.log("1st isImagePdfDocxXlsxCsv:  "); //yes file
    //console.log(file);

    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("pdf")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("xlsx")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("csv")) {
      callback(null, true);
    } else if (file.mimetype.endsWith("docx")) {
      callback(null, true);
    } else {
      callback(new Error("Only Image is allowed"));
    }
  };

  // var upload = multer({ storage: multerConfig, fileFilter: isImage }).array(
  //   "photo",
  //   2
  // ); //multiple
  var upload = multer({
    storage: multerConfig,
    fileFilter: isImagePdfDocxXlsxCsv,
  }).single("attachment"); //single

  upload(req, res, function (err) {
    //console.log(req.file); //complete file
    if (!req.file) {
      // console.log("No file upload");
      return res.end("Error uploading file.");
    } else {
      // console.log(req.file.filename);
      // var imgsrc = domainpath + "/uploads/category/" + req.file.filename; //url to save
      //var imgsrc = "/" + req.file.destination + "/" + req.file.filename; //url to save this is correct wd /slash
      var imgsrc = "/" + req.file.path; //url to save this is correct wd /slash
      // console.log(imgsrc);
      res.status(200).json({
        success: "Success",
        url: imgsrc,
      });
    }
  });
};
//++++++++++++++++++++++++SINGLE++++++++++++++++++++++++++++//ENDS

//-------------------------------------------------------------------------------------------------------------
module.exports = {
  Employee,
  Project,
  Logs,
};
