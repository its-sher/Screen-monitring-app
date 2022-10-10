const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
//mysql - session-------
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
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
//session
const sessionStore = new MySQLStore({}, con);
app.use(
  session({
    name: "sid",
    key: process.env.SESSION_COOKIE_KEY,
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    //sameSite: true, // it works true only if secure is true or options
    store: sessionStore,
    cookie: {
      //path: "/",  //-------------------------by default same
      //_expires: 60000,//60seconds
      //originalMaxAge: null,
      //httpOnly: true, //---------------------by default same
      //secure: true,//-----------------------by default false
      maxAge: 30 * 24 * 60 * 60 * 1000, //1month
      // Forces to use https in production
      secure: process.env.NODE_ENV === "production" ? true : false, // now development so false
    },
  })
);

console.log("Inside index.js");
//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const loginRouter = require("./routes/Login");
app.use("/login", GenuineToken, loginRouter);

const userRouter = require("./routes/User");
app.use("/user", GenuineToken, userRouter);

const accesstokenRouter = require("./routes/AccessToken");
app.use("/accesstoken", GenuineToken, accesstokenRouter);

// const clientRouter = require("./routes/Client");
// app.use("/client", GenuineToken, clientRouter);

// const projectRouter = require("./routes/Project");
// app.use("/project", GenuineToken, projectRouter);

// const logsRouter = require("./routes/Logs");
// app.use("/logs", logsRouter);

app.listen(port, () => console.log(`Listen on port ${port}`));
