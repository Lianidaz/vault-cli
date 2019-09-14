const fetch = require("node-fetch")
const fs = require("fs")
const os = require("os")
const log = require("./logger")

const Vault = opts => {
  return {
    address:
      (opts.parent.address ||
        process.env.VAULT_ADDR ||
        "http://localhost:8200") + "/v1/",
    token: process.env.VAULT_TOKEN
      ? process.env.VAULT_TOKEN
      : fs.existsSync(os.homedir() + "/.vault-token")
      ? fs.readFileSync(os.homedir() + "/.vault-token", "utf8").split("\n")[0]
      : "",
    kvname: opts.parent.kvname
  }
}

const read = async (path, opts) => {
  const V = Vault(opts)
  log.debug(`Reading ${path}`)
  const res = await fetch(V.address + V.kvname + "/data/" + path, {
    method: "GET",
    headers: { "X-Vault-Token": V.token }
  }).then(res => res.json())
  log.debug(`Response :${JSON.stringify(res)}`)
  return res.errors
    ? { error: res.errors[0] }
    : res.data
    ? { data: res.data.data, path: path }
    : { data: "", path: path }
}

const write = async (data, path, opts) => {
  const V = Vault(opts)
  log.debug(`Writing to ${path}`)
  const res = await fetch(V.address + V.kvname + "/data/" + path, {
    method: "POST",
    headers: { "X-Vault-Token": V.token },
    body: JSON.stringify({ data: data })
  }).then(res => res.json())
  log.debug(`Response :${JSON.stringify(res)}`)
  return res.errors ? { error: res.errors[0] } : res.data
}

const list = async (path, opts) => {
  const V = Vault(opts)
  const res = await fetch(V.address + V.kvname + "/metadata/" + path, {
    method: "LISt",
    headers: { "X-Vault-Token": V.token }
  }).then(res => res.json())
  return res.errors ? { error: res.errors[0] } : res.data.keys
}

const readTree = async (path, opts) => {
  const rs = async (pth, acc, opts) => {
    const tr = await list(pth, opts)
    if (tr instanceof Error) return new Error(`No such path: ${pth}`)
    for (k of tr) {
      if (k.indexOf("/") == -1) {
        acc.push(await read(pth + k, opts))
      } else await rs(pth + k, acc, opts)
    }
    return acc
  }
  return { root: path, values: await rs(path, [], opts) }
}

const writeTree = async (tree, dst, opts) => {
  const prom = tree.values.map(s =>
    write(s.data, dst ? s.path.replace(tree.root, dst) : s.path, opts)
  )
  return Promise.all(prom)
    .then(p => p)
    .catch(e => log.error(e))
}

module.exports = {
  secret: {
    read: read,
    write: write
  },
  tree: {
    read: readTree,
    write: writeTree,
    list: list
  },
  misc: {
    isJson: x => {
      try {
        JSON.parse(x)
      } catch (e) {
        return false
      }
      return true
    }
  }
}
