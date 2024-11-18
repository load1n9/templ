import { parseArgs } from "@std/cli/parse-args";
import { helpCommand, versionCommand } from "./commands.ts";
import { red } from "@std/fmt/colors";

const flags = parseArgs(Deno.args, {
  boolean: ["help", "yaml", "json"],
  alias: {
    help: "h",
  },
});

if (flags.yaml && flags.json) {
  throw new Error("Cannot use both --yaml and --json flags.");
}

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
  default:
    helpCommand(red(`Unknown command: ${flags._[0]}`));
    Deno.exit(1);
}
