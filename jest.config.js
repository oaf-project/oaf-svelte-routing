module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  "transformIgnorePatterns": [],
  "collectCoverage": true,
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  },
  // We mess with globals (window, document) in the tests so
  // this keeps them from interfering with each other.
  "maxConcurrency": 1
}