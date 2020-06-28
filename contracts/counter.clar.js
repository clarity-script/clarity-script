import { defineData, definePublic, Int, ok } from '../src/clarity-script'

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