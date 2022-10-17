const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
//
const cors = require("cors");
const port = process.env.PORT; //8000
const GenuineToken = require("./allUrlsTokenAuth"); //token chk
// We support json requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
const con = require("./models/db"); //for db connection
//
//to get attachments via url++++++++++++++++++++++++++++++++STARTS
app.use("/uploads", express.static("uploads"));
//to get attachments via url++++++++++++++++++++++++++++++++ENDS
//
//CORS --Allow cors everywhere
app.use(cors());
//specific
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN1,
      //    process.env.CORS_ORIGIN2,
      //  process.env.CORS_ORIGIN3,
      //process.env.CORS_ORIGIN4,
    ], //3000 frontend and 5000backend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
console.log("Inside index.js");
//
app.get("/", (req, res) => {
  res.send("Hello You are Welcome to Screen Monitoring App");
});

//PENDING-------------------------------------------------------------STARTS
const accesstokenRouter = require("./routes/AccessToken");
app.use("/accesstoken", GenuineToken, accesstokenRouter);

const loginRouter = require("./routes/Login");
app.use("/login", GenuineToken, loginRouter);
//PENDING-------------------------------------------------------------ENDS

const userRouter = require("./routes/Employee");
app.use("/employee", GenuineToken, userRouter);

const clientRouter = require("./routes/Client");
app.use("/client", GenuineToken, clientRouter);

const projectRouter = require("./routes/Project");
app.use("/project", GenuineToken, projectRouter);

const logsRouter = require("./routes/Logs");
app.use("/logs", logsRouter);

app.listen(port, () => console.log(`Listen on port ${port}`));
