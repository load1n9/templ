import { stringify } from "@std/yaml/stringify";
import { Table } from "@cliffy/table";
import { bold, brightMagenta, gray, yellow } from "@std/fmt/colors";
import commands from "./commands.json" with { type: "json" };
import { projectToTemplate } from "./template.ts";

export async function generateTemplate(format: "json" | "yaml" = "yaml") {
  console.log("Generating template...");
  const path = prompt("Enter the path to the project: ") ?? ".";
  const name = prompt("Enter the name of the project: ") ?? "project";
  const description = prompt("Enter the description of the project: ") ?? "";
  const version = prompt("Enter the version of the project: ") ?? "0.1.0";
  console.log("Generating template...");
  const template = await projectToTemplate(path, {
    name,
    description,
    version,
  });
  return format === "json"
    ? JSON.stringify(template, null, 2)
    : stringify(template);
}

export function helpCommand(message?: string): void {
  const table: Table = new Table();
  table.body(
    commands.map((
      command,
    ) => [bold(brightMagenta(command.name)), gray(command.description)]),
  );
  table.padding(4);
  console.log(
    `${message !== undefined ? message + "\n" : ""}${
      bold(brightMagenta("💉 Templ"))
    } ${yellow("-")} ${gray("A CLI for creating templates.")}
  
  ${bold(yellow("Usage"))}:
    ${bold(brightMagenta("templ"))} ${yellow("<command>")} ${gray("[options]")}
  
  ${bold(yellow("Commands"))}:
    ${table.toString().split("\n").join("\n  ")}`,
  );
}

export function versionCommand(): void {
  console.log(yellow("0.1.0"));
}
