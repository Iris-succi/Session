const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const router = require("./router");

const app = express();

// use some application-level middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
const Session = require("express-session");
const FileStore = require("session-file-store")(Session);

app.use(
  Session({
    store: new FileStore({
      path: path.join(__dirname, "/tmp"),
      encrypt: true,
    }),
    secret: "Super Secret !",
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(express.json());

// Serve the public folder for public resources
app.use(express.static(path.join(__dirname, "../public")));

// Serve REACT APP
app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

// API routes
app.use(router);

// Redirect all requests to the REACT app
const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
);

if (fs.existsSync(reactIndexFile)) {
  app.get("*", (req, res) => {
    res.sendFile(reactIndexFile);
  });
}

// ready to export
module.exports = app;
