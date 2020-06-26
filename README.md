# CrispyScript Proposal
Proposal for creating a JavaScript compatible language that compiles to [Clarity](https://clarity-lang.org/)

## Abstract
With a rise of blockchain protocols and smart contract technology there was an emergence of new programming languages designed specifically for Blockchain application. One of such examples is [Clarity](https://clarity-lang.org/), the language powering platforms like [Blockstack](https://blockstack.org/) and [Algorand](https://www.algorand.com/). Clarity closely follows [Lisp](https://lisp-lang.org/) in its syntax and implementation, so it's predictable (not Turing complete) and gurantied to execute in a predictable amount of time while being enterpreted in runtime.

Despite its many security features Clarity could be considered to as a bottleneck for mass adoption by existing global developer community. For some there might be a decent learning curve to conceptualize functional programming and familiarize with a new unusual syntax. To provide a smooth smart contract developer experience we a proposing to desing and create a subset of JavaScript called CrispyScript, that meant it's just a simplified JavaScript without some features.

## Examples
Let's compare implementing a common `Counter` example written in Clarity:
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

and written in CrispyScript:
```javascript
import { defineData, definePublic, Int, ok } from 'CrispyScript'

const counter = defineData(Int, 0)

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

And `HelloWorld` example written in Clarity:
```lisp
(define-public (say-hi)
   (ok "hello world"))

(define-public (echo-number (val int))
   (ok val))
```
and in CrispyScript:
```javascript
import { definePublic, Int, ok, typed } from 'CrispyScript'

definePublic(function sayHi() {
  return ok("hello world")
})

definePublic(typed(Int)(function echoNumber(val) {
  return ok(val)
}))
```

