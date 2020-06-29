
![Logo](https://avatars0.githubusercontent.com/u/67481887?s=200&v=4)
# ClarityScript Proposal
Proposal for creating a JavaScript compatible language that compiles to [Clarity](https://clarity-lang.org/)

## Abstract
With a rise of blockchain protocols and smart contract technology there was an emergence of new programming languages designed specifically for Blockchain application. One of such examples is [Clarity](https://clarity-lang.org/), the language powering platforms like [Blockstack](https://blockstack.org/) and [Algorand](https://www.algorand.com/). Clarity closely follows [Lisp](https://lisp-lang.org/) in its syntax and implementation, so it's predictable (not Turing complete) and gurantied to execute in a fixed amount of time while being interpreted in runtime.

Despite its security features Clarity could be considered as a bottleneck for mass adoption by existing global developer community. For some there might be a decent learning curve to conceptualize functional programming and familiarize with a new unusual syntax. To provide a smooth smart contract developer experience we are proposing to design and create a subset of JavaScript called ClarityScript, that means it's just a simplified JavaScript without some features.

## Working demo
1. Clone this repo into a folder and run  
`$ npm install`
2. Explore `counter.clar.js` and `hello-world.clar.js` in `contracts/` folder
3. To compile ClarityScript into Clarity run  
`$ npm run compile`  
You can see compiled contracts in `contracts/compiled/` folder
4. To test compiled `counter.clar` contract please run  
`$ npm test`


## Overview
Let's compare implementing a common `HelloWorld` example written in Clarity:
```lisp
(define-public (say-hi)
   (ok "hello world"))

(define-public (echo-number (val int))
   (ok val))
```
and in ClarityScript:
```javascript
import { definePublic, Int, ok, typed } from 'clarity-script'

definePublic(function sayHi() {
  return ok("hello world")
})

definePublic(typed(Int)(function echoNumber(val) {
  return ok(val)
}))
```

Also `Counter` example written in Clarity:
```lisp
(define-data-var counter int 0)

(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 1))
    (ok (var-get counter))))
    
(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 1))
    (ok (var-get counter))))
    
(define-public (get-counter)
  (ok (var-get counter)))
```

and written in ClarityScript:
```javascript
import { defineData, definePublic, Int, ok } from 'clarity-script'

const counter = defineData('counter', Int, 0)

definePublic(function increment() {
  counter.set(counter.get() + 1)
  return ok(counter.get())
})

definePublic(function decrement() {
  counter.set(counter.get() - 1)
  return ok(counter.get())
})

definePublic(function getCounter() {
  return ok(counter.get())
})
```

## A subset of JavaScript
As you can see above ClarityScript is looking very familiar to any modern developer and able to run and compile everywhere without any problem. But there are some limitations and specifics imposed to keep full compatibility with Clarity. For example there are no `for` or `while` loops (use `.filter`, `.map`, `.reduce`), variables must be declared with things like `defineData`, function parameters are `typed` and return value is wrapped in `ok` statement and functions are exported with `definePublic` wrapper.

## Comes with a framework and runtime
ClarityScript comes with a framework that provides equivalent for every Clarity native [function or keyword](https://docs.blockstack.org/core/smart/clarityref). For example for working with `map` data structure you could use:
```javascript
import { defineMap, Int } from 'clarity-script'

const map = defineMap('map', {key: Int}, {value: Int})
map.insert({key: 1}, {value: 10})
```

which would work as intended in any JS environment or could compile to Clarity:
```lisp
(define-map map ((key int)) ((value int)))
(map-insert map (tuple (key 1)) (tuple (value 10))) 
```

## Compiling Clarity into ClarityScript
Following the same design principles would make it possible to compile any Clarity code into ClarityScript and be able to run it in browser or node. This would open many possibilities like writing and testing Clarity/ClarityScript smart contracts right in browser and even creating a version of Stacks 2.0 protocol in JavaScript as an alternative core implementation.
