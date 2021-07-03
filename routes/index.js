const express = require("express");
const { existsSync, readFile, writeFile } = require("fs");
const { nanoid } = require("nanoid");
const { join } = require("path");

const router = express.Router();

router.get("/test", (req, res, next) => {
  try {
    res.status(200).json({ msg: "Working" });
  } catch (error) {
    next(error);
  }
});

router.get("/:topic", (req, res, next) => {
  try {
    let { topic } = req.params;
    let file = join(__dirname, "../data/" + topic + ".json");
    let exists = existsSync(file);
    if (exists) {
      res.sendFile(file);
    } else throw new Error("Invalid request.");
  } catch (error) {
    next(error);
  }
});

router.put("/:topic&:id", (req, res, next) => {
  try {
    let { topic, id } = req.params;
    let { body } = req;
    body.id = id;
    let file = join(__dirname, "../data/" + topic + ".json");
    let exists = existsSync(file);
    if (exists) {
      readFile(file, (err, data) => {
        if (err) {
          throw new Error("Problem reading file.");
        }

        let parsedData = JSON.parse(data);

        parsedData = parsedData.map((entry) => {
          if (entry.id == id) {
            return body;
          } else return entry;
        });

        writeFile(file, JSON.stringify(parsedData), (err) => {
          if (err) {
            throw new Error("Problem rewriting file.");
          }

          res.json({ msg: "Successfully updated resource.", id });
        });
      });
    } else throw new Error("Invalid request.");
  } catch (error) {
    next(error);
  }
});

router.delete("/:topic&:id", (req, res, next) => {
  try {
    let { topic, id } = req.params;
    let file = join(__dirname, "../data/" + topic + ".json");
    let exists = existsSync(file);
    if (exists) {
      readFile(file, (err, data) => {
        if (err) {
          throw new Error("Problem reading file.");
        }

        let parsedData = JSON.parse(data);

        parsedData = parsedData.filter((entry) => entry.id != id);

        writeFile(file, JSON.stringify(parsedData), (err) => {
          if (err) {
            throw new Error("Problem rewriting file.");
          }

          res.json({ msg: "Successfully deleted resource.", id });
        });
      });
    } else throw new Error("Invalid request.");
  } catch (error) {
    next(error);
  }
});

router.post("/:topic", (req, res, next) => {
  try {
    let { topic } = req.params;
    let { body } = req;
    let file = join(__dirname, "../data/" + topic + ".json");
    let exists = existsSync(file);
    if (exists) {
      readFile(file, (err, data) => {
        if (err) {
          throw new Error("Problem reading file.");
        }

        let parsedData = JSON.parse(data);
        body.id = nanoid();
        parsedData.push(body);

        writeFile(file, JSON.stringify(parsedData), (err) => {
          if (err) {
            throw new Error("Problem rewriting file.");
          }

          res.json({ msg: "Successfully added to resource.", id: body.id });
        });
      });
    } else throw new Error("Invalid request.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
