const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const upload = multer({ dest: "upload/" });
const itemControllers = require("./controllers/itemControllers");

router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

router.post("/upload", upload.single("avatar"), (req, res) => {
  // On récupère le nom du fichier
  const { originalname } = req.file;

  // On récupère le nom du fichier
  const { filename } = req.file;

  // On utilise la fonction rename de fs pour renommer le fichier
  fs.rename(
    `upload/${filename}`,
    `upload/${uuidv4()}-${originalname}`,
    (err) => {
      if (err) throw err;
      res.send("File uploaded");
    }
  );
});

router.get("/session-in", (req, res) => {
  req.session.song = "be bop a lula";
  res.send();
});

router.get("/session-out", (req, res) => {});

module.exports = router;
