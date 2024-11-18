import { walk } from "@std/fs";
import { decodeBase64, encodeBase64 } from "@std/encoding/base64";

/**
 * File entry.
 */
export interface FileEntry {
  /** Path to the file. */
  path: string;

  /** Name of the file. */
  name: string;

  /** Content of the file. */
  content: string;
}

/**
 * Project.
 */
export interface Template {
  /** Name of the Template. */
  name: string;

  /** Description of the Template. */
  description: string;

  /** Version of the Template. */
  version: string;

  /** Files in the Template. */
  files: FileEntry[];

  /** Directories in the Template. */
  directories: string[];
}

/**
 * Convert a project to a template.
 */
export async function projectToTemplate(
  dir: string,
  options: { name: string; description: string; version: string },
): Promise<Template> {
  const template: Template = {
    name: options.name,
    description: options.description,
    version: options.version,
    files: [],
    directories: [],
  };
  for await (const file of walk(dir)) {
    if (file.isDirectory) {
      template.directories.push(file.path);
    }
    if (file.isFile) {
      const content = await Deno.readTextFile(file.path);
      template.files.push({
        path: file.path,
        name: file.name,
        content: encodeBase64(content),
      });
    }
  }
  return template;
}

/**
 * Convert a template to a project.
 */
export async function templateToProject(
  template: Template,
  dir: string,
): Promise<void> {
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
