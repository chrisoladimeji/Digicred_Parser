// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Only *.unit.spec.ts under __tests__ will run
  testMatch: [
    '<rootDir>/__tests__/**/*.unit.spec.ts'
  ],

  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

export default config;
