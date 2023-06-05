import chalk from "chalk";
import { execaSync } from "execa";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import prompt from "@posva/prompts";
import type { Choice } from "@posva/prompts";
import { Fzf } from "fzf";

interface Project {
  path: string;
  desc?: string;
  sort?: number;
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
      sort: getMaxSort(content) + 1,
    },
  });
  writeFileSync(configFile, JSON.stringify(json));
  console.log(chalk.greenBright(`${name}已设置成功`));
}

// 获取项目列表
type ProjectList = { title: string; value: string; description: string }[];
function getProjectList(content?: Record<string, Project>, showPath?: boolean): ProjectList {
  const contentJson = content ?? readConfigFile(projectsFile);
  const keys = Object.keys(sortContent(contentJson));
  if (keys.length === 0) {
    console.log(chalk.yellowBright("您还没有设置过任何link"));
    console.log(chalk.yellowBright("添加您的第一个link: lk add <alias> [path] [desc]"));
    return [];
  }

  return keys.map((key) => {
    const project = contentJson[key];
    return {
      title: chalk.yellowBright(key),
      value: key,
      description: `${chalk.grey(project.desc ?? "")} ${showPath ? chalk.grey(project.path) : ""}`,
    };
  });
}

// 列出项目
export function listProjects(): void {
  const list = getProjectList(undefined, true);
  if (list.length === 0) {
    return;
  }
  list.forEach((project) => {
    const { title, description } = project;
    console.log(chalk.greenBright(title), description);
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

//选择一个项目
export async function selectProject(content: Record<string, Project>) {
  const list = getProjectList(content);
  if (list.length === 0) {
    return "";
  }
  const choices = list.map((project) => ({
    title: project.title,
    value: project.value,
    description: project.description,
  }));
  const fzf = new Fzf(choices, {
    selector: (item) => {
      debugger;
      return `${item.title} ${item.description}`;
    },
    casing: "case-insensitive",
  });
  const { projectName } = await prompt({
    type: "autocomplete",
    name: "projectName",
    message: "请选择要打开的link",
    choices,
    async suggest(input: string, choices: Choice[]) {
      const results = fzf.find(input);
      return results.map((r) => choices.find((c) => c.value === r.item.value));
    },
  });

  return projectName;
}

//获取sort的最大值
function getMaxSort(content: Record<string, Project>): number {
  const keys = Object.keys(content);
  if (keys.length === 0) {
    return 0;
  }
  return Math.max(...keys.map((key) => content[key].sort ?? 0));
}

// 打开项目
export async function openProject(alias: string) {
  const content = readConfigFile(projectsFile);
  if (!alias) {
    alias = await selectProject(content);
  }
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
    const configFile = getConfigFile(projectsFile);
    const maxSort = getMaxSort(content);
    content[alias].sort = maxSort + 1;
    writeFileSync(configFile, JSON.stringify(content));
    console.log(chalk.greenBright(`${alias}已打开`));
  }
}

// 根据sort, 给content降序排序
function sortContent(content: Record<string, Project>): Record<string, Project> {
  const keys = Object.keys(content);
  const sortList = keys.map((key) => {
    return {
      key,
      value: content[key],
    };
  });
  sortList.sort((a, b) => (b.value.sort ?? 0) - (a.value.sort ?? 0));
  const sortedContent: Record<string, Project> = {};
  sortList.forEach(({ key }) => {
    sortedContent[key] = content[key];
  });
  return sortedContent;
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
