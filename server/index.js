const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
//
const cors = require("cors");
const port = process.env.PORT; //8000
//const GenuineToken = require("./allUrlsTokenAuth"); //token chk
const { GenuineToken } = require("./ApiMiddleware");

// We support json requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
//to get attachments via url++++++++++++++++++++++++++++++++STARTS
app.use("/uploads", express.static("uploads"));
//to get attachments via url++++++++++++++++++++++++++++++++ENDS
//
//CORS --Allow cors everywhere
//app.use(cors());
//specific
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN1,
      //    process.env.CORS_ORIGIN2,
      //  process.env.CORS_ORIGIN3,
      //process.env.CORS_ORIGIN4,
    ], //3000 frontend and 8000backend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//console.log("Inside index.js");
//
app.get("/", (req, res) => {
  const Response = `<h1>"Hello You are Welcome to Screen Monitoring App."</h1>
  <h2>This is test url to check whether server is working fine on port ${port}</h2>`;
  res.send(Response);
});
//
//--------------ROUTES-----------------------------------------------------------------------------------------
const userRouter = require("./routes/Employee");
app.use("/employee", GenuineToken, userRouter);

const accesstokenRouter = require("./routes/AccessToken");
app.use("/accesstoken", GenuineToken, accesstokenRouter);

const loginRouter = require("./routes/Login");
app.use("/login", loginRouter);

const logoutRouter = require("./routes/Logout");
app.use("/logout", GenuineToken, logoutRouter);
//-------------------------------------------------------------

const clientRouter = require("./routes/Client");
app.use("/client", GenuineToken, clientRouter);

const projectRouter = require("./routes/Project");
app.use("/project", projectRouter);

const taskRouter = require("./routes/Task");
app.use(
  "/task",
  //GenuineToken,
  taskRouter
);

const logsRouter = require("./routes/Logs");
app.use("/logs", logsRouter);

const attachmentsRouter = require("./routes/Attachments");
app.use("/attachments", attachmentsRouter);

app.listen(port, () => console.log(`Listen on port ${port}`));
