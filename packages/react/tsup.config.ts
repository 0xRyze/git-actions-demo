import { defineConfig } from 'tsup'

const env = "production"

export default defineConfig({
    splitting: false,
    clean: true, // clean up the dist folder
    dts: false, // generate dts files
    format: ['cjs', 'esm'], // generate cjs and esm files
    minify: env === 'production',
    bundle: env === 'production',
    skipNodeModulesBundle: true,
    entryPoints: ['src/index.ts'],
    target: 'es2020',
    outDir: env === 'production' ? 'dist' : 'lib',
    entry: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.jsx'], //include all files under src
})
