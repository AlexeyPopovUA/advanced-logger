if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/browser/advanced-logger.browser.min.js");
} else {
    module.exports = require("./dist/browser-debug/advanced-logger.browser.js");
}
