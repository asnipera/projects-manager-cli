<h1 align="center">link-manager-cli</h1>

<p align="center">
open file or dir by terminal wherever you are
</p>
<p align="center">
<a href="https://www.npmjs.com/package/link-manager-cli"><img src="https://img.shields.io/npm/v/link-manager-cli?color=a1b858&label=" alt="link-manager-cli"></a>
</p>

![image](https://github.com/asnipera/projects-manager-cli/blob/master/gif/pm.gif)

## Install

```bash
npm install -g link-manager-cli
```

## Bin

```bash
"bin": {
   "link-manager-cli": "bin/index.mjs",
   "lkm": "bin/index.mjs",
   "lk": "bin/index.mjs"
}
```

## Config Client

```bash
pm set-client <client>
```

for example

```bash
pm set-client code

or

pm set-client pycharm
```

`vscode` is as default client

## Usage

add a project to the project list

if you don't specify the projectPath, the `current path` will be used

```bash
lk add <projectName> [projectPath]
```

remove a project from the project list

```bash
lk remove <projectName>
```

list all projects

```bash
lk list
```

open a project

```bash
lk <projectName>
```

## See help for more information

```
lk --help
```

## License

MIT
