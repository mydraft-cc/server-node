"use strict";
const Libsecurity = require("Libsecurity");

class HelperXhr {
  /**
   * Return req.xhr state to determine if request is xhr type
   * @param {object} req - req Express var
   * @return {boolean}
   */
  static isXhrRequest(req) {
    if (req && req.headers && req.headers.accept) {
      return req.headers.accept.indexOf("json") > -1;
    }
    return false;
  }
  /**
   * Push received Data on object
   * @return object
   */
  static setSettings(req) {
    let obj = {};
    console.log(req);
    try {
      if (req.method.match(/POST|PUT/i)) {
        obj = Object.keys(req.body).length > 0 ? req.body : {};
      } else if (req.method.match(/GET/i)) {
        //no body with GET method !! use query.data
        obj = req.query && req.query.data ? JSON.parse(req.query.data) : {};
      } else {
        throw new Error(
          "HelperXhr::setSettings-req.method not supported-" + req.method
        );
      }
      // // Parsing req.body API receive only json so string is JSON
      // if (typeof obj === "string") {
      //   obj = JSON.parse(obj);
      // }
      //check size
      if (typeof obj === "object") {
        Libsecurity.jsonSizeIsAcceptable(obj, req.app.get("JSONMAXSIZE"));
      }
      //url paramèters are also put in object
      if (req.params && typeof req.params === "object") {
        for (let param in req.params) {
          obj[param] = req.params[param];
        }
      }
      return obj;
    } catch (error) {
      //if called from controller to call express error handler
      throw error;
    }
  }
}
module.exports = HelperXhr;
