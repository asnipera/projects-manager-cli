<h1 align="center">projects-manager-cli</h1>

<p align="center">
open project by terminal wherever you are
</p>
<p align="center">
<a href="https://www.npmjs.com/package/projects-manager-cli"><img src="https://img.shields.io/npm/v/projects-manager-cli?color=a1b858&label=" alt="projects-manager-cli"></a>
</p>

## Install

```bash
npm install -g projects-manager-cli
```

## Bin

```bash
"bin": {
   "projects-manager-cli": "bin/index.mjs",
   "pmc": "bin/index.mjs",
   "pm": "bin/index.mjs",
   "py": "bin/index.mjs"
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

```bash
pm config <projectName> <projectPath>
```

remove a project from the project list

```bash
pm remove <projectName>
```

list all projects

```bash
pm list
```

open a project

```bash
pm <projectName>
```

## See help for more information

```
pm --help
```

## License

MIT
