import { cac } from "cac";
import chalk from "chalk";
import pkg from "../package.json";
import { detProject, listProjects, openProject, setClinetName, setProject, updateConfig } from "./utils";

const cli = cac();

cli
  .command("add <name> [path] [desc]", "add a link")
  .example("lk add uc /Users/xxx/uc")
  .action((name, path, desc) => {
    setProject(name, path, desc);
  });

cli.command("list", "list all links").action(() => {
  listProjects();
});

cli.command("remove <name>", "remove link").action((name) => {
  detProject(name);
});

cli.command("[name]", "open link").action((name) => {
  openProject(name);
});

cli.command("set-client <clientName>", "set client name").action((name) => {
  setClinetName(name);
});

cli.command("update-config").action(() => {
  updateConfig();
});

// Listen to unknown commands
cli.on("command:*", () => {
  const invalidCommand = cli.args.join(" ");
  console.log("Invalid command: %s", chalk.red(invalidCommand));
  console.log("See %s for a list of available commands.", chalk.greenBright("--help"));
  process.exit(1);
});
cli.help();
cli.version(pkg.version);
cli.parse();
