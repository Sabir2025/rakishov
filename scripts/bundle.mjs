import {createRequire} from 'node:module';
const {build}=createRequire(import.meta.url)('esbuild');
import {fileURLToPath} from 'node:url';
await build({absWorkingDir:fileURLToPath(new URL('../',import.meta.url)),entryPoints:['js/app.js'],outfile:'js/site.bundle.js',bundle:true,format:'iife',target:['chrome90','firefox90','safari15'],minify:false,legalComments:'none'});
console.log('Classic browser bundle built; translations included, no startup network request.');
