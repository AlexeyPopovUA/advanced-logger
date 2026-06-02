/** @type {import('jest').Config} */
const sharedConfig = {
    preset: "ts-jest",
    moduleFileExtensions: ["ts", "js", "json"],
    // lodash-es ships native ESM; transform its .js files for the CJS Jest runtime.
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "node_modules/lodash-es/.+\\.js$": [
            "ts-jest",
            {tsconfig: {allowJs: true, esModuleInterop: true, module: "commonjs"}},
        ],
    },
    transformIgnorePatterns: ["/node_modules/(?!lodash-es/)"],
    clearMocks: true,
    restoreMocks: true,
};

/** @type {import('jest').Config} */
module.exports = {
    projects: [
        {
            ...sharedConfig,
            displayName: "unit",
            testEnvironment: "node",
            testMatch: [
                "**/__tests__/**/*.spec.ts",
                "!**/__tests__/integration/runtime/**",
            ],
            collectCoverageFrom: ["src/**/*.ts"],
            coveragePathIgnorePatterns: ["/node_modules/"],
        },
        {
            ...sharedConfig,
            displayName: "runtime",
            testEnvironment: "node",
            testMatch: ["**/__tests__/integration/runtime/**/*.spec.ts"],
        },
    ],
};
