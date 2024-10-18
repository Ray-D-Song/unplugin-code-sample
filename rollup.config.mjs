import typescript from '@rollup/plugin-typescript';
import { glob } from 'glob';
import { defineConfig } from 'rollup';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';

const entryPoints = glob.sync('src/*.ts');

export default defineConfig([
  {
    input: entryPoints,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        exports: 'auto',
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].js',
      },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: entryPoints,
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [dts()],
  },
]);