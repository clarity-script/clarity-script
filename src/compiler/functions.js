const { assign } = Object

function defineData(name, Type, defaultValue) {
  const hyphenName = name.replace(/"/g, '').replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
  return assign(
    Object(`(define-data-var ${hyphenName} ${Type} ${defaultValue})\n`),
     {
      get: () => `(var-get ${hyphenName})`,
      set: (value) => `(var-set ${hyphenName} ${value})`,
    }
  )
}

function definePublic(f) {
  return `(define-public ${f})\n\n`
}

function Int() {
  return 'int'
}

function ok(response) {
  return `(ok ${response})`
}

function typed(...types) {
  return (f, context)=> {
    context.typed.types = types
    const result = f()
    context.typed.types = []
    return result
  }
}


export {defineData, definePublic, Int, ok, typed}
