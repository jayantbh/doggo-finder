export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },

  transform: {
    "\\.(ts|tsx)?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(scss|sass|css)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
