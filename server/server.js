const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: '../key.json',
  project_id: "perceptive-ivy-202402"
});

app.use(bodyParser.json());

app.post("/upload", upload.single("myImage"), function(req, res) {
  client

    .webDetection(req.file.buffer)
    .then(results => {
        console.log(results[0].textAnnotations);
      const webDetection = results[0].webDetection;
      var identification = { breed: webDetection.webEntities[0].description };
      console.log(webDetection.webEntities[0].description);
      res.json(webDetection.webEntities[0].description);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});


app.post("/uploadText", upload.single("myImage"), function(req, res) {
  client
    .textDetection(req.file.buffer)
    .then(results => {
      console.log(results);
      const textDetection = results[0].fullTextAnnotation;
      var identificationT = { breed: textDetection.text};
      console.log(textDetection.text);
      res.json(textDetection.text);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

app.listen(3001);
