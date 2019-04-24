if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/node/advanced-logger.node.min.js");
} else {
    module.exports = require("./dist/node-debug/advanced-logger.node.js");
}
