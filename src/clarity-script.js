let _context = {
  data: {},
  maps: {},
  publicExports: {},
  readOnly: {},
  privateExports: {}
};


function getContext() {
  return _context
}

function setContext(context) {
  return _context = context
}

function defineData(name, Type, defaultValue) {
  if (!Type(defaultValue)) throw `Wrong type for defining ${name}: ${typeof defaultValue}`
  if (_context.data[name] == null) _context.data[name] = defaultValue;

  return {
    get: () => _context.data[name],
    set: (value) => Type(value) ?
      _context.data[value]
      : throw `Wrong type for setting ${name}: ${typeof value}`
  }
}

function definePublic(f) {
  _context.publicExports[f.name] = f
  return f
}

function Int(value) {
  return typeof value === 'number'
}

function ok(response) {
  return response
}

function typed(...types) {
  return f => (...args) =>
    args.every((arg, i) => types[i] && types[i](arg) ) ?
      f(...args)
      : throw `Wrong types ${JSON.stringify(args)}`
}


export {getContext, setContext, defineData, definePublic, Int, ok, typed}
