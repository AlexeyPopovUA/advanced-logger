module.exports = {
    "transform": {
        ".(ts)": "ts-jest"
    },
    "collectCoverageFrom": [
        "src/**/*.ts"
    ],
    "coveragePathIgnorePatterns": [
        "/__tests__/",
        "/node_modules/"
    ],
    "testEnvironment": "node",
    "testRegex": "__tests__/.*\\.spec\\.ts$",
    "moduleFileExtensions": [
        "ts",
        "js",
        "json"
    ],
    "moduleNameMapper": {
        "fetchFacade$": "node-fetch"
    }
};