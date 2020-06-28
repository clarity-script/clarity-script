const { assign } = Object

function defineData(name, Type, defaultValue) {
  return assign(
    Object(`(define-data-var ${name} ${Type} ${defaultValue})`),
     {
      get: () => `(define-data-var ${name} ${Type} ${defaultValue})`,
      set: (value) => Type(defaultValue) ?
        context.data[name] = value
        : throw 'Wrong Type'
    }
  )
}

function definePublic(f) {
  context.publicExports[f.name] = f
  return f
}

function Int(value) {
  return typeof value === 'number'
}

function ok(response) {
  return response
}


export {defineData, definePublic, Int, ok}
