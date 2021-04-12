import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default commandLineArgs => {
    const isDebug = commandLineArgs.configDebug === true ? 'inline' : false;
    delete commandLineArgs.input;
    return {
        input: './src/main.ts',
        output: {
            dir: '.',
            sourcemap: isDebug,
            format: 'cjs',
            exports: 'default'
        },
        external: ['obsidian'],
        plugins: [
            json(),
            typescript(),
            nodeResolve({browser: true}),
            commonjs(),
        ]
    }
};

