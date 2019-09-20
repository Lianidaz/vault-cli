# Vault-CLI

An extended cli tool to interact with Hashicorp Vault KV

Meant to ease interaction on levels highter than the standard tool allows.

Features:

- Read/write secrets
- Read/write tree of secrets
- Export/import as JSON file
- Copy secret/tree

## Installation

### Binaries

Grab the latest version [here](https://github.com/Lianidaz/vault-cli/releases)
Run as a binary

### Build from Source

You must have Node.js 10+ installed.

```bash
git clone https://github.com/Lianidaz/vault-cli.git
cd vault-cli
npm i -g pkg
npm run build
```

Or run as JS file:

```bash
./cli.js -h
```

---

## Usage

For any operation you must have a token as an environment variable **VAULT_TOKEN**, it may also be supplied in a file **.vault-token** in your home directory

Also you will need URL of Vault instance as **VAULT_ADDR** as environment variable or supplied with _--address_ flag.

```
Usage: vault-cli COMMAND [OPTIONS]

Tool for better interaction wit Hashicorp Vault

Options:
  -V, --version                  output the version number
  -v, --verbosity <level>        verbosity level ('fatal', 'error', 'warn', 'info', 'debug') (default: "error")
  -A, --address <address>        Vault address
  -K, --kvname <name>            name of KV engine you wish to interact with (default: "secret")
  -h, --help                     output usage information

Commands:
  read [options] <path>          Read the contents of a secret or tree. Note, path of a tree must end with '/'
  write [options] [path] [data]  Write [data] to [path]. Data must be a valid JSON. You may import a file with --file option.
  list <path>                    List contents of a path
  copy <src> <dst>               Copy contents of a secret/tree
```

### Read

```
Usage: read [options] <path>

Read the contents of a secret or tree. Note, path of a tree must end with '/'

Options:
  -o, --out <file>  Write result to file
  -h, --help        output usage information
```

Sends secret to STDOUT or a file if _--out_ flag is specified

Ouputs data as JSON with secret contents in _data_ field and it's path in _path_

```json
$ vault-cli read food
{
  "data": {
    "foo": "bar"
  },
  "path": "foo/bar"
}
```

Also allows reading tree of secret. Note, path to a tree must end with `/`

```json
$ vault-cli read foo/
[
  {
    "data": {
      "foo": "bar"
    },
    "path": "foo/bar"
  },
  {
    "data": {
      "foo": "far"
    },
    "path": "foo/far"
  }
]
```

### Write

```
Usage: write [options] [path] [data]

Write [data] to [path]. Data must be a valid JSON. You may import a file with --file option.

Options:
  -f, --file <file>  Specify source file. Must be in the format of 'read' command output or a valid JSON. In last case [path] is required
  -h, --help         output usage information
```

### List

```
Usage: list [options] <path>

List contents of a path

Options:
  -h, --help  output usage information
```

### Copy

```
Usage: copy [options] <src> <dst>

Copy contents of a secret/tree

Options:
  -h, --help  output usage information
```
