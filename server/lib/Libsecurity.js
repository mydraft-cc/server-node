"use strict";

class Libsecurity {
  /**
   *
   * @param {object} obj
   * @param {number} maxsize
   * @returns
   */
  static jsonSizeIsAcceptable(obj, maxsize) {
    const size = JSON.stringify(obj).length;
    if (typeof obj === "object" && size > maxsize)
      throw new Error(
        "Warning Date received exceed defined max size - Libsecurity",
        "size received:",
        obj.length,
        "acceptable",
        size
      );
    return true;
  }

  /**
   *
   * @param {string} str  - filename to sanitize
   * @returns
   */
  static sanitizeFileName(str) {
    return str
      .replace(/(.*\/)|(\/.*)/g, "")
      .replace(/\.\./g, "")
      .replace(/;/g, "");
  }
}

module.exports = Libsecurity;
