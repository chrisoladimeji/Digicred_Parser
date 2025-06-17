   // jest.config.ts
   import type { Config } from '@jest/types';

   const config: Config.InitialOptions = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
     testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)'],
     transform: {
       '^.+\\.(ts|tsx)$': 'ts-jest',
     },
    };

   export default config;