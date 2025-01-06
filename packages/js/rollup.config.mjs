import ts from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'build/index.esm.js',
                format: 'es',
            },
            {
                file: 'build/index.cjs.js',
                format: 'cjs',
                interop: 'esModule',
            }
        ],
        external: ['react'],
        plugins: [
            PeerDepsExternalPlugin(),
            resolve({ extensions: ['.js', '.ts']}),
            commonjs(),
            ts({ tsconfig: './tsconfig.json'}),
        ],
    },
    {
        input: "./build/dts/index.d.ts",
        output: [{ file: "build/index.d.ts", format: "es" }],
        plugins: [
            dts(), 
            del({ hook: 'buildEnd', targets: 'build/dts'})
        ],
    },
]