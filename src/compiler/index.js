import cherow from 'cherow'

import * as functions from './functions.js'
import tokens from './tokens.js'


let _context = {
  variables: {},
  typed: {},
  scope: [{}],
};


function setNewContext() {
  return _context = {
    variables: {},
    typed: {},
    scope: [{}],
  };
}


export function compile(script) {
  setNewContext()
  const ast = cherow.parseModule(script)
  return processAst(ast)
}


function processAst(ast) {
  if (!(ast && ast.type)) throwError(`Unknown syntax: ${JSON.stringify(ast)}`)
  return tokenProcessor[ast.type] ?
    tokenProcessor[ast.type](ast)
    : throwError(`Unknown syntax type: ${ast.type}`)
}


const tokenProcessor = {
  Program: (ast)=> ast.body.map(processAst).join(''),

  ImportDeclaration: (ast)=>
    ast.source.value.includes('clarity-script') ?
      ''
      : throwError(`Unexpected import from ${ast.source.value}`),

  VariableDeclaration: (ast) => {
    if (ast.kind !== 'const') throwError('Should be const declaration')
    return `${ast.declarations.map(processAst).join('\n')}\n`
  },

  VariableDeclarator: (ast) =>
    _context.variables[ast.id.name] = processAst(ast.init),

  CallExpression: (ast) => {
    switch (ast.callee.type) {
      case "Identifier": {
        if (!functions[ast.callee.name])
          throwError(`Unknown function ${ast.callee.name}`)
        // TODO add locally defined functions

        return functions[ast.callee.name](...ast.arguments.map(processAst))
      }

      case "MemberExpression": {
        const object = processAst(ast.callee.object)
        if (!object)
          throwError(`Unknown syntax: ${JSON.stringify(ast.callee.object)}`)

        return object[ast.callee.property.name](...ast.arguments.map(processAst))
      }

      case "CallExpression": {
        const wrapper = processAst(ast.callee)

        return wrapper(() => ast.arguments.map(processAst), _context)
      }

      default: {
        console.error(ast)
        throwError(`Unknown callee type ${ast.callee.type}`)
      }
    }
  },

  Literal: (ast) => JSON.stringify(ast.value),

  Identifier: (ast) => {
    const scope = _context.scope[_context.scope.length - 1];
    if (!functions[ast.name] && !_context.variables[ast.name] && !scope[ast.name])
      throwError(`Unknown identifier ${ast.name}`)

    return functions[ast.name] ?
      functions[ast.name]()
      : _context.variables[ast.name] || scope[ast.name]
  },

  ExpressionStatement: (ast) => processAst(ast.expression),
  ReturnStatement: (ast) => processAst(ast.argument),

  FunctionExpression: (ast) => {
    const scope = Object.create(_context.scope[_context.scope.length - 1]);
    const params = ast.params.map((param, i) => {
        return scope[param.name] =
          Object.assign(Object(param.name),
            {name: param.name, type: _context.typed.types[i]});

      }
    )
    _context.scope.push(scope);
    const fn = tokens['function'](
      ast.id.name,
      params,
      processAst(ast.body)
    )
    _context.scope.pop()
    return fn
  },

  BlockStatement: (ast) => ast.body.map(processAst),

  BinaryExpression: (ast) => tokens[ast.operator]([ast.left, ast.right].map(processAst)),
}

function throwError(error) {
  throw new Error(error)
}
