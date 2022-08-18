const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts",
    "tsx"
  ],
  "moduleDirectories": ["node_modules", "<rootDir>/"],
  "testRegex": ".*\\.spec\\.ts(x)$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/pages/**/*.(t|j)sx",
    "**/src/**/*.(t|j)sx",
    "**/pages/**/*.(t|j)s",
    "**/src/**/*.(t|j)s",
  ],
  "coveragePathIgnorePatterns": [
    "/.next",
    "pages/_app.tsx",
    "src/main.ts",
    "src/common/migrations/",
    ".config.ts"
  ],
  "coverageDirectory": "./coverage",
  "testEnvironment": "jest-environment-jsdom"
};
module.exports = createJestConfig(customJestConfig);
