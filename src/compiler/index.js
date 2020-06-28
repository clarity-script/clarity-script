import cherow from 'cherow'
import {readFileSync} from 'fs'

export function parse(script) {
  return cherow.parseModule(script)
}

console.log(parse(readFileSync('./examples/counter.crispy.js').toString()))
