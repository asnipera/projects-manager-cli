import { cac } from "cac";
import chalk from "chalk";
import pkg from "../package.json";
import { detProject, listProjects, openProject, setExeClinetName, setProject } from "./utils";

const cli = cac();

cli
  .command("config <name> <path>", "config a project path")
  .example("py config uc /Users/xxx/uc")
  .action((name, path) => {
    setProject(name, path);
  });

cli.command("list", "list all projects").action(() => {
  listProjects();
});

cli.command("remove <name>", "remove project").action((name) => {
  detProject(name);
});

cli
  .command("<name>", "open project")
  .alias("pm")
  .action((name) => {
    openProject(name);
  });

cli.command("set-client <clientName>", "set client name").action((name) => {
  setExeClinetName(name);
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