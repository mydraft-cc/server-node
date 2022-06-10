"use strict";

/**
 * Not use logger here use try catch and next(Error) in catch bloc to call the global error handler
 */
const express = require("express");
const router = express.Router();
const HelperXhr = require("HelperXhr");
const Libsecurity = require("Libsecurity");
const fs = require("fs");

//Dir storage
const datadir = __dirname + "/data";
let response = "";
let codestatus = 500;

/**
 * see swagger model
 * Store json file
 */
router.post("/", async function (req, res, next) {
  try {
    //check data received
    let xhr = HelperXhr.setSettings(req);
    if (Array.isArray(xhr) && xhr[0].payload.diagramId) {
      const id = xhr[0].payload.diagramId;
      if (id) {
        if (fs.existsSync(datadir)) {
          fs.writeFileSync(datadir + "/" + id, JSON.stringify(xhr));
          codestatus = 200;
          response = { writeToken: id, readToken: id };
        }
      }
    } else {
      throw new Error("Json structure is wrong");
    }
    res.status(codestatus).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * see swagger model
 */
router.put("/:tokenWrite/:tokenRead", async function (req, res, next) {
  try {
    const tokenWrite = req.params.tokenWrite;
    const tokenRead = req.params.tokenRead;
    //check data received
    let xhr = HelperXhr.setSettings(req);

    if (
      Array.isArray(xhr) &&
      xhr[0] &&
      xhr[0].payload &&
      xhr[0].payload.diagramId &&
      tokenWrite &&
      tokenWrite === tokenRead &&
      tokenWrite === xhr[0].payload.diagramId
    ) {
      const id = xhr[0].payload.diagramId;
      if (id) {
        fs.writeFileSync(datadir + "/" + id, JSON.stringify(xhr));
        codestatus = 200;
        response = { writeToken: id, readToken: id };
      }
    } else {
      throw new Error("Json structure is wrong");
    }
    res.status(codestatus).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 *   2 cases
 *   - isXhr request return json
 *   - else public/index.html
 */
router.get("/get/:diagramId", function (req, res, next) {
  try {
    const id = Libsecurity.sanitizeFileName(req.params.diagramId);
    response = JSON.parse(fs.readFileSync(datadir + "/" + id, "utf8"));
    codestatus = 200;
    res.status(codestatus).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
