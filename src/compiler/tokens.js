export default {
  'function': (name, args, body) => {
    const hypenName = name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)
    return `(${hypenName}${args.length ? ' ' : ''}${args.map(({name, type}) => `(${name} ${type})`).join(' ')})
  ${body.length === 1 ?
      `${body[0]}`
      : `(begin\n${body.map((line)=> `    ${line}`).join('\n')})`
    }`
  },

  '+': (items) => `(+ ${items.join(' ')})`,
  '-': (items) => `(- ${items.join(' ')})`,
}