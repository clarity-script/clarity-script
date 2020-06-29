import { definePublic, Int, ok, typed } from '../src/clarity-script'

definePublic(function sayHi() {
  return ok("hello world")
})

definePublic(typed(Int)(function echoNumber(val) {
  return ok(val)
}))