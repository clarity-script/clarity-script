import {readdirSync, readFileSync, writeFileSync} from "fs";
import {compile} from './src/compiler/index.js';

readdirSync('./contracts')
.filter((name) => name.endsWith('.clar.js'))
.forEach((name) =>
  writeFileSync(`./contracts/compiled/${name.replace(/.js$/, '')}`,
    compile(readFileSync(`./contracts/${name}`).toString()))
)

// console.log(compile(readFileSync('../../contracts/counter.clar.js').toString()))
// console.log('\n\n')
//console.log(compile(readFileSync('../../contracts/hello-world.clar.js').toString()))
