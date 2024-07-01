/**
 * @type {import("../../../tools").TContextualizedMethod}
 */
module.exports = async (runner, context) => {
  const { version } = context.getNxInformation();
  
  // plubishable: a library marked as publishable (npm publish)
  // buildable: a library marked as a "build" dist output

  /**
   * @type {import('..').ISettings}
   */
  const settings = context.getSettings();

  const isPublishable = !!settings.publishable;
  const isBuildable = !!settings.buildable;
  let publishableArg = "";
  const buildableArg = `--buildable=${isBuildable}`;
  const tagArg = isBuildable || isPublishable ? '--tags="REQUIRED:GOLDEN"' : "";
  if (isPublishable) {
    const npmOrganization = settings.npm.organization;
    const importPath = `@${npmOrganization}/${context.getProjectName()}`;
    publishableArg = `--publishable --importPath=\"${importPath}\"`;
  }

  const cmds = [
    // For fastest build in typescript location (engine for api)
    // To reference workspace libraries in monorepo
    context.whenNotInstalled("tsconfig-paths", (pkg) => {
      return `npm install -D ${pkg}`;
    }),

    // Nx generator dependency
    context.whenNotInstalled("@nx/nest", (pkg) => {
      return `npm install -D ${pkg}@${version}`;
    }),

    // Project creation
    `npx nx g @nx/nest:lib ${context.getProjectName()} --directory=libs/${context.getProjectName()} --projectNameAndRootFormat=as-provided ${publishableArg} ${buildableArg} ${tagArg}`,

  ].filter((c) => c != null);

  await runner.execute(cmds, { cwd: context.getRootPath() });
};
