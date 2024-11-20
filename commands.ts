import { Table } from "@cliffy/table";
import { bold, brightMagenta, gray, yellow } from "@std/fmt/colors";
import commands from "./commands.json" with { type: "json" };
import { projectToTemplate, type Template } from "./template.ts";
import { decodeBase64 } from "@std/encoding/base64";

export async function generateTemplate() {
  console.log("Generating template...");
  const path = prompt("Enter the path to the project: ") ?? ".";
  const name = prompt("Enter the name of the project: ") ?? "project";
  const description = prompt("Enter the description of the project: ") ?? "";
  const version = prompt("Enter the version of the project: ") ?? "0.1.0";
  const outputFilename = prompt("Enter the output filename: ") ??
    crypto.randomUUID().split("-")[0] + ".template.json";
  console.log("Generating template...");
  const template = await projectToTemplate(path, {
    name,
    description,
    version,
  });
  await Deno.writeTextFile(outputFilename, JSON.stringify(template, null, 2));
}

/**
 * Convert a template to a project.
 */
export async function templateToProject(
  template: Template,
): Promise<void> {
  const dir = prompt("Enter the path to the project: ") ?? ".";
  for (const directory of template.directories) {
    await Deno.mkdir(`${dir}/${directory}`, { recursive: true });
  }
  for (const file of template.files) {
    const content = new TextDecoder().decode(
      decodeBase64(file.content),
    );
    await Deno.writeTextFile(`${dir}/${file.path}`, content);
  }
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
