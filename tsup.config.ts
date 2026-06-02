import {defineConfig} from "tsup";

const entry = {index: "src/index.ts"};

export default defineConfig([
    // ESM + CJS + type declarations for bundler/Node consumers.
    // The few small runtime deps are bundled in (zero runtime dependencies):
    // `lodash-es` and `fast-safe-stringify` are bundled in (zero runtime deps).
    // Events use an in-house `EventEmitter`; `fetch` is a runtime global.
    {
        entry,
        format: ["esm", "cjs"],
        dts: true,
        sourcemap: true,
        clean: true,
        target: "es2020",
        noExternal: ["lodash-es", "fast-safe-stringify"],
        outExtension({format}) {
            return {js: format === "cjs" ? ".cjs" : ".mjs"};
        }
    },
    // Self-contained browser global (IIFE) for <script> consumers.
    // Inlines runtime deps; uses native `fetch` and the in-house `EventEmitter`.
    {
        entry,
        format: ["iife"],
        globalName: "advancedLogger",
        platform: "browser",
        minify: true,
        sourcemap: true,
        target: "es2015",
        noExternal: [/.*/],
        outExtension() {
            return {js: ".global.js"};
        }
    }
]);
