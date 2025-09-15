const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
require("./db.js");
const cors = require("cors");

const server = express();

server.name = "BizSupply API";

// ----- CORS -----
const allowedOrigins = [
  "https://bizupply.netlify.app",
  "http://localhost:5173",
  "http://localhost:8080"
];

server.use(cors({
  origin: function(origin, callback) {
    // permitir requests sin origin (como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// ----- Middlewares -----
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// ----- Rutas -----
server.use("/api", routes);

// ----- Manejo de errores -----
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
