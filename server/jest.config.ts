import { Config } from '@jest/types';

const config : Config.InitialOptions = {
    verbose: true,
    testEnvironment: 'node',
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js)$": "babel-jest",
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        }
    },
};

export default config
