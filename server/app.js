require("include-path")(["./lib"]);
const express = require("express");
//to parser body as json fetch must have parameter
//headers: {
//  'Content-Type': 'application/json',
//},
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
//Helpers
const HelperXhr = require("HelperXhr");
//Logs nodejs
//--> http: morgan
const morgan = require("morgan");
const logger = require("logger");
//cors
const cors = require("cors");
//framework express
const app = express();
//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//API routes
const routes = require("./routes.js");

//Swagger UI
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocumentCore = YAML.load("./openapi.yaml");
const swaggeroptions = {
  explorer: true,
};

//cors options - no options
app.use(cors({}));

/**
 * explainations : https://dev.to/p0oker/why-is-my-browser-sending-an-options-http-request-instead-of-post-5621
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, InstantKey, Content-Length, X-Requested-With"
  );
  //OPTIONS methods interception
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// listening port server
app.set("PORT", process.env.PORT || "4000");
// listening IP address server
app.set("IPADDRESS", process.env.IPADDRESS || "0.0.0.0");
// Max size allowed to upload Json files (Default is 2Mo)
app.set("JSONMAXSIZE", process.env.JSONMAXSIZE || 2 * 1024 * 1024);

//logger become global to controller via req.app.get('logger')
app.set("logger", logger);

//Application logs - format see wiki about morgan logs
let loghttpformat = "combined";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//set log http
app.use(morgan(loghttpformat));

// Routes
try {
  // route / load public content
  app.use("/", express.static(path.join(__dirname, "public")));
  // route /api-docs load Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocumentCore, swaggeroptions)
  );
  // route /xxx-xxx-xxxx where xxx-xxx-xxx is a diagram Id
  app.use(
    "/:diagramId",
    express.static(path.join(__dirname, "public", "index.html"))
  );
  // API Routes
  app.use(routes);
} catch (err) {
  // logger.error(err.toString(), err);
  logger.error(err.toString(), err);
}

// resource not found - 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("Resource is missing");
  req.statusCode = 404;
  next(new Error(), req, res);
});

// Global error handler
app.use(function (err, req, res, next) {
  let statuscode = req.statusCode; //404 received ???
  if (!statuscode) statuscode = 500;
  if (statuscode !== 404) {
    logger.error(err.toString(), err);
    message = "Internal Error - see logs";
  } else {
    message = "404-Resource Not Found";
  }
  if (HelperXhr.isXhrRequest(req)) {
    res.status(statuscode).json({ error: message });
  } else {
    res.status(statuscode).send("<html><h1>" + message + "</h1></html>");
  }
});

const httpServer = http.createServer(app);

//catch httpServer Errors type uncaughtException :EADDRNOTAVAIL EADDRINUSE
process.on("uncaughtException", function (err) {
  logger.error(err.toString(), err);
});

//start server
httpServer.listen(app.get("PORT"), app.get("IPADDRESS"), function () {
  logger.info({
    listeningonipaddress: app.get("IPADDRESS"),
    listeningonport: app.get("PORT"),
  });
});

module.exports = app;
