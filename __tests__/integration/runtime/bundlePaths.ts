import fs from "node:fs";
import path from "node:path";

export const NODE_BUNDLE = path.resolve(
    __dirname,
    "../../../dist/index.cjs"
);
export const BROWSER_BUNDLE = path.resolve(
    __dirname,
    "../../../dist/index.global.js"
);

export function assertBundlesExist(): void {
    const missing: string[] = [];

    if (!fs.existsSync(NODE_BUNDLE)) {
        missing.push(NODE_BUNDLE);
    }
    if (!fs.existsSync(BROWSER_BUNDLE)) {
        missing.push(BROWSER_BUNDLE);
    }

    if (missing.length > 0) {
        throw new Error(
            "Built bundles not found:\n" +
                missing.map(p => `  - ${p}`).join("\n") +
                "\n\nRun `npm run test:integration` or `npm run build` first."
        );
    }
}
