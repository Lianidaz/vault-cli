const log = require("./logger")
const { secret, tree, misc } = require("./helps")
const fs = require("fs")

const read = async (path, opts) => {
  try {
    const resp =
      path[path.length - 1] == "/"
        ? await tree.read(path, opts)
        : await secret.read(path, opts)
    if (resp.error) throw new Error(resp.error)
    const json = resp.data
      ? JSON.stringify(resp, null, 2)
      : resp.values
      ? JSON.stringify(resp.values, null, 2)
      : `Failed to read ${path}`
    if (opts._name != "read") {
      return resp
    }
    if (opts.out) {
      if (!fs.existsSync(opts.out)) fs.writeFileSync(opts.out, "", "utf8")
      const out = fs.createWriteStream(opts.out, { flags: "a" })
      out.write(json)
      log.info(`Written contents to file ${opts.output}:\n\n${json}`)
    } else {
      log.debug(resp)
      console.log(json)
    }
  } catch (e) {
    log.fatal(e)
  }
}

const write = async (path, data, opts) => {
  try {
    let resp = {}
    if (opts.file) {
      const inp = fs.readFileSync(opts.file)
      if (misc.isJson(inp)) {
        file = JSON.parse(inp)
        if (file[0] && file[0].path && file[0].data) {
          resp = await tree.write(file, opts)
        } else if (file && file.path && file.data) {
          resp = await secret.write(file.path, file.data, opts)
        } else if (path) {
          resp = await secret.write(file, path, opts)
        } else {
          throw new Error("Not enough data")
        }
      }
    } else if (data && path) {
      resp = await secret.write(JSON.parse(data), path, opts)
    } else {
      throw new Error("Not enough data")
    }
    if (resp.error) throw new Error(resp.error)
    log.debug(resp)
  } catch (e) {
    log.fatal(e)
  }
}

const list = async (path, opts) => {
  try {
    path = path[path.length - 1] == "/" ? path : `${path}/`
    const resp = await tree.list(path, opts)
    console.log(resp.join("\n"))
    log.debug(resp)
  } catch (e) {
    log.fatal(e)
  }
}

const copy = async (src, dst, opts) => {
  try {
    let resp
    const obj = await read(src, opts)
    if (src[src.length - 1] == "/") resp = await tree.write(obj, dst, opts)
    else resp = await secret.write(obj.data, dst, opts)
    log.debug(resp)
  } catch (e) {
    log.fatal(e)
  }
}

const del = async (path, opts) => {
  try {
    let resp
    if (path[path.length - 1] == "/") {
    } else resp = secret.del(path, opts)
    log.debug(resp)
  } catch (e) {
    log.fatal(e)
  }
}

module.exports = {
  read,
  write,
  list,
  copy,
  del
}
