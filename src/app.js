const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
require("./db.js");
const cors = require("cors");

const server = express();

server.name = "BizSupply API";

// Orígenes permitidos
const allowedOrigins = [
  "https://bizupply.netlify.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

// CORS correcto
server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// ❌ Eliminar este middleware que pisaba los headers (causa del error CORS)
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

server.use("/api", routes);

// Error handler
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;