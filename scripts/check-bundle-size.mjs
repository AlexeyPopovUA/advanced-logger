import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const config = require("../bundlesize.config.js");

function parseMaxSize(maxSize) {
    const match = /^(\d+(?:\.\d+)?)\s*(kB|KB|MB|B)$/i.exec(maxSize.trim());
    if (!match) {
        throw new Error(`Invalid maxSize: ${maxSize}`);
    }
    const value = Number(match[1]);
    const unit = match[2].toUpperCase();
    if (unit === "B") {
        return value;
    }
    if (unit === "KB") {
        return value * 1000;
    }
    if (unit === "MB") {
        return value * 1000 * 1000;
    }
    throw new Error(`Unsupported unit in maxSize: ${maxSize}`);
}

let failed = false;

for (const file of config.files) {
    const filePath = path.resolve(file.path);
    if (!fs.existsSync(filePath)) {
        console.error(`Missing bundle: ${file.path}`);
        failed = true;
        continue;
    }
    const size = fs.statSync(filePath).size;
    const limit = parseMaxSize(file.maxSize);
    if (size > limit) {
        console.error(
            `${file.path}: ${size} bytes exceeds limit ${file.maxSize} (${limit} bytes)`
        );
        failed = true;
    } else {
        console.log(`${file.path}: ${size} bytes (limit ${file.maxSize})`);
    }
}

if (failed) {
    process.exit(1);
}
