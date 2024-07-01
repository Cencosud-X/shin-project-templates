import type { TUtils } from "./utils";

export interface IRunner {
  execute: (
    cmds: string | string[],
    options: IRunnerOptions
  ) => Promise<string>;
}

export interface IRunnerOptions {
  cwd: string;
}

export type TContextualizedMethod = (
  runner: IRunner,
  context: TUtils
) => Promise<void>;

export type TRawMethod = (
  runner: IRunner,
  args: IRawArgs
) => Promise<void>;

interface IRawArgs {
  rc: Object;
}

interface INxInformation {
  version: string;
  workspace: string;
  prefix: string;
  semver: ISemver;
}

interface ISemver {
  major: string;
  minor: string;
  patch: string;
}

interface IPackageInformation {
  name: string;
  version: string;
  semver: ISemver;
}

interface ISettingDefinition {
  name: string;
  icons: Object;
  url: Object;
}

interface IRc {
  name: string;
  description: string;
  settings: Object;
  $schema: string;
  workspace_path: Object;
  group_folder: Object;
  path: Object;
  kind: Object;
  definition: ISettingDefinition;
  settings: Object;
}
