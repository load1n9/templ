import { parseArgs } from "@std/cli/parse-args";
import { generateTemplate, helpCommand, templateToProject, versionCommand } from "./commands.ts";
import { red } from "@std/fmt/colors";
import type { Template } from "./template.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["help"],
  alias: {
    help: "h",
  },
});

if (
  flags.help || flags._.length === 0 || flags._[0] === "help"
) {
  helpCommand();
  Deno.exit(0);
}

switch (flags._[0]) {
  case "version":
    versionCommand();
    break;
  case "build":
    generateTemplate();
    break;
  case "gen": {
    if (flags._[1] == undefined) {
      helpCommand(red("Missing template name."));
      Deno.exit(1);
    }
    const template: Template = await (await fetch(flags._[1] as string)).json();
    await templateToProject(template);
    break;
  }
  default:
    helpCommand(red(`Unknown command: ${flags._[0]}`));
    Deno.exit(1);
}
