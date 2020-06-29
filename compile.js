import {readdirSync, readFileSync, writeFileSync} from "fs";
import {compile} from './src/compiler/index.js';

readdirSync('./contracts')
.filter((name) => name.endsWith('.clar.js'))
.forEach((name) =>
  writeFileSync(`./contracts/compiled/${name.replace(/.js$/, '')}`,
    compile(readFileSync(`./contracts/${name}`).toString()))
)
