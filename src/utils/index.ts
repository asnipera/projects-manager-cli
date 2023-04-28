import chalk from "chalk";
import { execaSync } from "execa";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

interface Project {
  path: string;
  desc?: string;
}

const projectsFile = "projects.json";
const initFile = "config.json";

// 获取根目录
function getRoot(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "../../");
}

// 获取配置文件路径
function getConfigFile(file: string): string {
  return path.resolve(getRoot(), file);
}

//读取配置文件
function readConfigFile(file: string): Record<string, Project> {
  const configFile = getConfigFile(file);
  if (existsSync(configFile)) {
    const content = readFileSync(configFile, "utf-8");
    return JSON.parse(content);
  }
  return {};
}

// 设置项目
export function setProject(name: string, path?: string, desc?: string): void {
  if (!path || path === ".") {
    path = process.cwd();
  }
  if (!existsSync(path)) {
    console.log(chalk.yellowBright(`文件或文件夹不存在: ${path}`));
    return;
  }
  const configFile = getConfigFile(projectsFile);
  const content = readConfigFile(projectsFile);
  const json = Object.assign(content, {
    [name]: {
      path,
      desc,
    },
  });
  writeFileSync(configFile, JSON.stringify(json));
  console.log(chalk.greenBright(`${name}已设置成功`));
}

// 列出项目
export function listProjects(): void {
  const content = readConfigFile(projectsFile);
  const keys = Object.keys(content);
  if (keys.length === 0) {
    console.log(chalk.yellowBright("您还没有设置此link"));
    console.log(chalk.yellowBright("设置项目: lk add <alias> [path] [desc]"));
    return;
  }
  keys.forEach((key) => {
    console.log(chalk.greenBright(`${key}: ${[content[key].desc, content[key].path].join("，")}`));
  });
}

// 删除项目
export function detProject(alias: string): void {
  const configFile = getConfigFile(projectsFile);
  const content = readConfigFile(projectsFile);
  delete content[alias];
  writeFileSync(configFile, JSON.stringify(content));
  console.log(chalk.greenBright(`${alias}已删除`));
}

// 打开项目
export function openProject(alias: string) {
  const content = readConfigFile(projectsFile);
  const project = content[alias];
  if (!project) {
    console.log(`请先设置${alias}的路径: ${chalk.greenBright(`lk add ${alias} <path>`)}`);
    return;
  }
  if (!existsSync(project.path)) {
    console.log(chalk.red(`文件或文件夹不存在: ${project}`));
    return;
  }
  const config = readConfigFile(initFile);
  const clientName = config.clientName || "code";
  const { stderr } = execaSync(`${clientName} ${project.path}`);
  if (stderr) {
    console.log(chalk.red(stderr));
  } else {
    console.log(chalk.greenBright(`${alias}已打开`));
  }
}

// 设置exe客户端名称
export function setClinetName(name: string) {
  const configFile = getConfigFile(initFile);
  const content = readConfigFile(initFile);
  const json = Object.assign(content, { clientName: name });
  writeFileSync(configFile, JSON.stringify(json));
  console.log(chalk.greenBright(`客户端已设置为: ${name}`));
}

export function updateConfig() {
  const content = readConfigFile(projectsFile);
  const keys = Object.keys(content);
  if (keys.length === 0) {
    return;
  }
  keys.forEach((key) => {
    if (typeof content[key] === "string") {
      content[key] = {
        path: content[key] as unknown as string,
      };
    }
  });

  const configFile = getConfigFile(projectsFile);
  writeFileSync(configFile, JSON.stringify(content));
  console.log(chalk.greenBright("更新成功"));
}
