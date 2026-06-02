import {defineConfig} from "tsup";

const entry = {index: "src/index.ts"};

export default defineConfig([
    // ESM + CJS + type declarations for bundler/Node consumers.
    // The few small runtime deps are bundled in (zero runtime dependencies):
    // `lodash-es` and `fast-safe-stringify` are bundled in (zero runtime deps).
    // `events` stays external as a Node builtin (bundlers polyfill it);
    // `fetch` is a runtime global.
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
    // Inlines runtime deps and polyfills `events`; uses native `fetch`.
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
