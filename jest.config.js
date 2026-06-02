/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.spec.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    clearMocks: true,
    restoreMocks: true,
};
