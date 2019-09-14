#!/usr/bin/env node

const cli = require("commander")
const log = require("./logger")
const actions = require("./actions")

cli
  .name("vault-cli")
  .description("Tool for better interaction wit Hashicorp Vault")
  .usage("COMMAND [OPTIONS]")
  .version(require("./package.json").version)

cli
  .option(
    "-v, --verbosity <level>",
    "verbosity level ('fatal', 'error', 'warn', 'info', 'debug')",
    "error"
  )
  .option("-A, --address <address>", "Vault address")
  .option(
    "-K, --kvname <name>",
    "name of KV engine you wish to interact with",
    "secret"
  )

cli
  .command("read <path>")
  .description(
    "Read the contents of a secret or tree. Note, path of a tree must end with '/'"
  )
  .option("-o, --out <file>", "Write result to file")
  .action(actions.read)

cli
  .command("write [path] [data]")
  .description(
    "Write [data] to [path]. Data must be a valid JSON. You may import a file with --file option."
  )
  .option(
    "-f, --file <file>",
    "Specify source file. Must be in the format of 'read' command output or a valid JSON. In last case [path] is required"
  )
  .action(actions.write)

cli
  .command("list <path>")
  .description("List contents of a path")
  .action(actions.list)

cli
  .command("copy <src> <dst>")
  .description("Copy contents of a secret/tree")
  .action(actions.copy)

cli.parse(process.argv)

log.setLevel(cli.verbosity)
